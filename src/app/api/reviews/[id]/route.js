import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

// DELETE - Delete a review by ID
export async function DELETE(request, { params }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { 
          message: 'Review ID is required',
          status: false,
          error: 'Missing ID'
        },
        { status: 400 }
      );
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: Number(id) },
    });

    if (!existingReview) {
      return NextResponse.json(
        {
          message: 'Review not found',
          status: false,
          error: 'Not found'
        },
        { status: 404 }
      );
    }

    const deletedReview = await prisma.review.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      status: true,
      message: 'Review deleted successfully',
      data: deletedReview,
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete review',
        status: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return NextResponse.json({ message: 'GET request received' });
}
  
  
// PUT - Update a review by ID
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { 
          message: 'Review ID is required',
          status: false,
          error: 'Missing ID'
        },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { reviewer, rating, comment, productId, status } = data;

    // Validate required fields
    if (!reviewer || !rating || rating < 1 || rating > 5 || !productId) {
      return NextResponse.json(
        {
          message: 'Reviewer name, rating (1-5), and product ID are required',
          status: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: Number(id) },
    });

    if (!existingReview) {
      return NextResponse.json(
        {
          message: 'Review not found',
          status: false,
          error: 'Not found'
        },
        { status: 404 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: 'Product not found',
          status: false,
          error: 'Invalid product ID'
        },
        { status: 404 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        reviewer: reviewer.trim(),
        rating: Number(rating),
        comment: comment?.trim() || null,
        productId: Number(productId),
        status: status || 'pending',
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: true,
      message: 'Review updated successfully',
      data: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update review',
        status: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
