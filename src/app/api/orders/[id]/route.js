import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
import nodemailer from 'nodemailer';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  take: 1
                }
              }
            }
          },
        },
      },
    });

    if (!order) {
      console.log('Order not found');
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Order Details:', order); // Log order details to the terminal
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, status, paymentMethod, paymentInfo } = await request.json();

    // Begin a transaction
    const updatedOrder = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          orderItems: true, // Include order items to access product ID and quantity
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (status === 'COMPLETED') {
        // Decrease the stock quantity of the products in the order
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }, // Decrement the stock by the order quantity
          });
        }
      }

      // Update the order status and other details
      return prisma.order.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status, // Set the status directly to the provided value
          paymentMethod,
          paymentInfo: paymentMethod === 'Credit Card' ? JSON.stringify(paymentInfo) : null,
          updatedAt: new Date(),
        },
      });
    });

    // Send email on status change (non-blocking - won't fail if email fails)
    if (updatedOrder && updatedOrder.email) {
      // Don't await - let it run in background without blocking the response
      sendStatusUpdateEmail({
        email: updatedOrder.email,
        name: updatedOrder.recipientName || 'Customer',
        orderId: updatedOrder.id,
        status: updatedOrder.status,
      }).catch((err) => {
        // Silently log email errors without affecting order update
        console.warn('Email notification failed (order update still successful):', err.message);
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// Function to send email notification when order status is updated
async function sendStatusUpdateEmail({ email, name, orderId, status }) {
  // Check if email credentials are configured
  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    console.warn('Email credentials not configured. Skipping email notification.');
    return;
  }

  // Validate email format
  if (!email || !email.includes('@')) {
    console.warn('Invalid email address:', email);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
          host: 'smtp.titan.email', // Hostinger's SMTP server
          port: 465, // Secure port for SMTP over SSL
          secure: true, // Use SSL
          auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
          },
      // Add timeout to prevent hanging
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
        });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: `Order Status Updated - Order ID #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Your order with ID <strong>#${orderId}</strong> has been updated to <strong>${status.toUpperCase()}</strong>.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✓ Status update email sent successfully to', email);
  } catch (error) {
    // Only log warning, don't throw - email failure shouldn't break order updates
    const errorMessage = error.response || error.message || 'Unknown error';
    console.warn(`⚠ Email notification failed for order #${orderId} (email: ${email}):`, errorMessage);
    // Don't rethrow - let the function fail silently
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const deletedOrder = await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(deletedOrder);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
