const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: 'pk23'
      },
      include: {
        images: true,
        subcategory: {
          include: {
            category: true
          }
        }
      }
    });
    
    console.log('Product found:', product);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();