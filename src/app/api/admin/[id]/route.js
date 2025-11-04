import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
// import prisma from "../../../util/prisma";

// GET request to fetch a specific admin user by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const admin = await prisma.adminUser.findUnique({ where: { id } });
    if (admin) {
      return NextResponse.json(admin);
    } else {
      return NextResponse.json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT request to update a specific admin user by ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, branch, role, email, password } = body;

    // Check if admin exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user not found', status: false, error: 'Not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!name || !branch || !role || !email) {
      return NextResponse.json(
        {
          message: 'Name, branch, role, and email are required',
          status: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (email !== existingAdmin.email) {
      const emailExists = await prisma.adminUser.findFirst({
        where: { email, NOT: { id } },
      });

      if (emailExists) {
        return NextResponse.json(
          {
            message: 'Email already exists',
            status: false,
            error: 'Duplicate email',
          },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData = { name, branch, role, email };
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    const updatedAdmin = await prisma.adminUser.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...updatedAdmin,
      status: true,
      message: 'Admin user updated successfully',
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      {
        message: 'Failed to update admin user',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE request to delete a specific admin user by ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Check if admin exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user not found', status: false, error: 'Not found' },
        { status: 404 }
      );
    }

    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({
      message: 'Admin deleted successfully',
      status: true,
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete admin user',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
