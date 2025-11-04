import { NextResponse } from 'next/server';
// import prisma from '../../../util/prisma';
import prisma from '../../util/prisma';

// POST request to create a new admin user
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, branch, role, email, password } = body;

    // Validation
    if (!name || !branch || !role || !email || !password) {
      return NextResponse.json(
        {
          message: 'All fields are required',
          status: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAdmin = await prisma.adminUser.findFirst({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          message: 'Email already exists',
          status: false,
          error: 'Duplicate email',
        },
        { status: 409 }
      );
    }

    const newAdmin = await prisma.adminUser.create({
      data: {
        name,
        branch,
        role,
        email,
        password,
      },
    });

    return NextResponse.json({
      ...newAdmin,
      status: true,
      message: 'Admin user created successfully',
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      {
        message: 'Failed to create admin user',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all admin users
export async function GET() {
  try {
    const admins = await prisma.adminUser.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    return NextResponse.json(Array.isArray(admins) ? admins : []);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch admin users',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
