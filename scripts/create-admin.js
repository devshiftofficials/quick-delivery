const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('dev786', 10);
    
    const admin = await prisma.user.upsert({
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

    console.log('Admin user created/updated successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();