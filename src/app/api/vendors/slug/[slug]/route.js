import { NextResponse } from 'next/server';
import prisma from '../../../../util/prisma';

export async function GET(_request, { params }) {
  try {
    const { slug } = params;
    const vendor = await prisma.vendor.findUnique({ where: { slug } });
    if (!vendor) return NextResponse.json({ status: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: vendor });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}


