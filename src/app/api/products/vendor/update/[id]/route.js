import { NextResponse } from 'next/server';
import prisma from '../../../../../util/prisma';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function PUT(request, { params }) {
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

    // Verify product belongs to this vendor
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
    }

    if (existingProduct.vendorId !== vendorId) {
      return NextResponse.json({ status: false, message: 'Forbidden: Not your product' }, { status: 403 });
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

    // Check if slug is being changed and if new slug exists
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json({
          status: false,
          message: "Product with this slug already exists.",
        }, { status: 400 });
      }
    }

    // Handle images update
    let imagesData;
    if (images) {
      const imageArray = Array.isArray(images) ? images : [images];
      
      // Delete existing images
      await prisma.image.deleteMany({
        where: { productId: productId },
      });

      // Create new images
      imagesData = {
        create: imageArray.map(filename => ({ url: filename }))
      };
    }

    // Update product
    const updateData = {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(stock !== undefined && { stock: parseInt(stock, 10) }),
      ...(subcategoryId && { subcategoryId: parseInt(subcategoryId, 10) }),
      ...(colors !== undefined && { colors: colors ? JSON.stringify(colors) : null }),
      ...(sizes !== undefined && { sizes: sizes ? JSON.stringify(sizes) : null }),
      ...(discount !== undefined && { discount: discount ? parseFloat(discount) : null }),
      ...(isTopRated !== undefined && { isTopRated: Boolean(isTopRated) }),
      ...(imagesData && { images: imagesData }),
      ...(meta_title !== undefined && { meta_title }),
      ...(meta_description !== undefined && { meta_description }),
      ...(meta_keywords !== undefined && { meta_keywords }),
      ...(sku !== undefined && { sku }),
    };

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        images: true,
      }
    });

    return NextResponse.json({
      status: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating vendor product:', error);
    return NextResponse.json(
      {
        message: 'Failed to update product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    // Verify product belongs to this vendor
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
    }

    if (existingProduct.vendorId !== vendorId) {
      return NextResponse.json({ status: false, message: 'Forbidden: Not your product' }, { status: 403 });
    }

    // Delete product (images will be cascade deleted)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      status: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vendor product:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete product',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

