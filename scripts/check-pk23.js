const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: 'pk23' },
      include: {
        images: true,
        subcategory: true
      }
    });
    console.log('Product:', product);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();