import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ status: true, data: vendors });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, email, phone, address, description, logo, banner, status } = body;

    const vendor = await prisma.vendor.create({
      data: { name, slug, email, phone, address, description, logo, banner, status: status || 'active' },
    });

    return NextResponse.json({ status: true, data: vendor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}


