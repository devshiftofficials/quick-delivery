import { NextResponse } from 'next/server';
import prisma from '../../../../util/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Get token from headers (Authorization: Bearer ...)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.decode(token);
    if (!decoded || decoded.role !== 'VENDOR') {
      return NextResponse.json({ status: false, message: 'Forbidden' }, { status: 403 });
    }
    const vendorId = decoded.vendorId;
    if (!vendorId) {
      return NextResponse.json({ status: false, message: 'Vendor ID missing' }, { status: 400 });
    }
    const products = await prisma.product.findMany({
      where: { vendorId },
      include: { 
        images: true, 
        subcategory: true,
        vendor: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return NextResponse.json({ status: true, data: products });
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    
    // Check if it's a connection error
    const errorMessage = error.message || 'Unknown error';
    const isConnectionError = errorMessage.toLowerCase().includes('can\'t reach database server') ||
                             errorMessage.toLowerCase().includes('connection') ||
                             errorMessage.toLowerCase().includes('database unavailable');
    
    return NextResponse.json({ 
      status: false, 
      message: isConnectionError 
        ? 'Database unavailable. Please check your connection and try again later.' 
        : 'Failed to fetch products. Please try again.',
      error: isConnectionError ? undefined : errorMessage
    }, { status: isConnectionError ? 503 : 500 });
  }
}
