const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('dev786', salt);
    
    // First, try to find if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' }
    });

    if (existingAdmin) {
      // Update existing admin user with new password
      const updatedAdmin = await prisma.user.update({
        where: { email: 'admin@gmail.com' },
        data: {
          password: hashedPassword,
          emailVerified: true,
          role: 'ADMIN'
        }
      });
      console.log('Admin user updated successfully:', updatedAdmin);
    } else {
      // Create new admin user
      const newAdmin = await prisma.user.create({
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
      console.log('Admin user created successfully:', newAdmin);
    }
  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();