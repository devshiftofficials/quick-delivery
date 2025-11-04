import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

// POST - Add a new review
export async function POST(request) {
  try {
    const data = await request.json();
    const { productId, reviewer, rating, comment, status } = data;

    // Input validation
    if (!productId || !reviewer || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { 
          message: 'Invalid input. Product ID, reviewer name, and rating (1-5) are required.',
          status: false,
          error: 'Missing required fields'
        },
        { status: 400 }
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

    // Create a new review in the database
    const newReview = await prisma.review.create({
      data: {
        productId: Number(productId),
        reviewer: reviewer.trim(),
        rating: Number(rating),
        comment: comment?.trim() || null,
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
      message: 'Review created successfully',
      data: newReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create review',
        status: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(Array.isArray(reviews) ? reviews : []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reviews', error: error.message, status: false },
      { status: 500 }
    );
  }
}

