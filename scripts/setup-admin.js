const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Delete any existing user with the admin email
    await prisma.user.deleteMany({
      where: {
        email: 'admin@gmail.com'
      }
    });

    // Create the admin user
    const hashedPassword = await bcrypt.hash('dev786', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();