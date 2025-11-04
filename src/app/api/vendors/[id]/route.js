import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';

export async function GET(_request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) return NextResponse.json({ status: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: vendor });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const vendor = await prisma.vendor.update({ where: { id }, data: body });
    return NextResponse.json({ status: true, data: vendor });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.vendor.delete({ where: { id } });
    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}


