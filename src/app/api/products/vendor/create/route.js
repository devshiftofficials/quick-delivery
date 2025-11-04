import { NextResponse } from 'next/server';
import prisma from '../../../../util/prisma';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request) {
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
    if (!vendorId) {
      return NextResponse.json({ status: false, message: 'Vendor ID missing' }, { status: 400 });
    }

    const {
      name,
      slug,
      description,
      price,
      stock,
      subcategoryId,
      colors,
      sizes,
      discount,
      isTopRated,
      images,
      meta_title,
      meta_description,
      meta_keywords,
      sku,
    } = await request.json();

    // Validate required fields
    if (!name || !slug || !description || !price || stock === undefined || !subcategoryId) {
      return NextResponse.json({
        status: false,
        message: "Missing required fields.",
      }, { status: 400 });
    }

    // Check for existing slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json({
        status: false,
        message: "Product with this slug already exists.",
      }, { status: 400 });
    }

    // Handle images
    let imagesData;
    if (images) {
      const imageArray = Array.isArray(images) ? images : [images];
      imagesData = {
        create: imageArray.map(filename => ({ url: filename }))
      };
    }

    // Create the new product with vendorId
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        subcategoryId: parseInt(subcategoryId, 10),
        colors: colors ? JSON.stringify(colors) : null,
        sizes: sizes ? JSON.stringify(sizes) : null,
        discount: discount ? parseFloat(discount) : null,
        isTopRated: Boolean(isTopRated),
        images: imagesData,
        meta_title,
        meta_description,
        meta_keywords,
        sku,
        vendorId, // Automatically set from token
      },
      include: {
        images: true,
      }
    });

    return NextResponse.json({
      status: true,
      message: 'Product created successfully',
      data: newProduct,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating vendor product:', error);
    return NextResponse.json(
      {
        message: 'Failed to create product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

