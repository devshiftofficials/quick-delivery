import { NextResponse } from 'next/server';
import prisma from '../../../../util/prisma';

export async function GET(_request, { params }) {
  try {
    const vendorId = parseInt(params.vendorId, 10);
    const products = await prisma.product.findMany({
      where: { vendorId },
      include: { images: true, subcategory: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ status: true, data: products });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

