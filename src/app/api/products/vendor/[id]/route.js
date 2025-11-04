import { NextResponse } from 'next/server';
import prisma from '../../../../util/prisma';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function GET(request, { params }) {
  try {
    // Get token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json({ status: false, message: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'VENDOR') {
      return NextResponse.json({ status: false, message: 'Forbidden' }, { status: 403 });
    }

    const vendorId = decoded.vendorId;
    const productId = parseInt(params.id, 10);

    // Fetch product and verify it belongs to this vendor
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
    }

    if (product.vendorId !== vendorId) {
      return NextResponse.json({ status: false, message: 'Forbidden: Not your product' }, { status: 403 });
    }

    // Parse colors and sizes from JSON strings
    let colorIds = [];
    let sizeIds = [];
    
    try {
      const parsedColors = product.colors ? 
        (product.colors.startsWith('"') ? JSON.parse(JSON.parse(product.colors)) : JSON.parse(product.colors)) 
        : [];
      colorIds = Array.isArray(parsedColors) ? parsedColors.map(Number) : [];
    } catch (e) {
      console.error('Error parsing colors:', e);
    }

    try {
      const parsedSizes = product.sizes ? 
        (product.sizes.startsWith('"') ? JSON.parse(JSON.parse(product.sizes)) : JSON.parse(product.sizes)) 
        : [];
      sizeIds = Array.isArray(parsedSizes) ? parsedSizes.map(Number) : [];
    } catch (e) {
      console.error('Error parsing sizes:', e);
    }

    // Fetch color and size details
    const colors = colorIds.length > 0 ? await prisma.color.findMany({
      where: { id: { in: colorIds.filter(id => !isNaN(id)) } },
    }) : [];

    const sizes = sizeIds.length > 0 ? await prisma.size.findMany({
      where: { id: { in: sizeIds.filter(id => !isNaN(id)) } },
    }) : [];

    return NextResponse.json({
      status: true,
      data: {
        ...product,
        colors,
        sizes,
      },
    });
  } catch (error) {
    console.error('Error fetching vendor product:', error);
    return NextResponse.json(
      { status: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

