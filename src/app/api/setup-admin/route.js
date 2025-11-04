import prisma from '../../util/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Hash the password
    const password = 'dev786';
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.upsert({
      where: {
        email: 'admin@gmail.com'
      },
      update: {},
      create: {
        email: 'admin@gmail.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return new Response(JSON.stringify({ message: 'Admin user created successfully', success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return new Response(JSON.stringify({ message: 'Failed to create admin user', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}