// server/api/products/newArrivals.js
import prisma from '../../../util/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch all products ordered by creation date (newest first)
    const allProducts = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc', // Order by creation date, most recent first
      },
      include: {
        images: true, // Include related images
        vendor: true, // Include vendor details
        subcategory: {
          include: {
            category: true, // Include category details
          },
        },
      },
    });

    // Filter products that have at least one image and stock > 0
    const filteredProducts = allProducts.filter(product => {
      const hasImages = product.images && product.images.length > 0;
      const hasStock = product.stock !== undefined && product.stock > 0;
      return hasImages && hasStock;
    });

    // Limit to 30 most recent products
    const newArrivals = filteredProducts.slice(0, 30);

    return NextResponse.json({ data: newArrivals, status: true }, { status: 200 });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return NextResponse.json({ message: 'Failed to fetch new arrivals', error: error.message, status: false }, { status: 500 });
  }
}
