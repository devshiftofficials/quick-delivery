// This script will create initial categories and subcategories
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create some initial categories
    const category1 = await prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        meta_title: 'Electronics',
        meta_description: 'Electronic items and gadgets'
      }
    });

    const category2 = await prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        meta_title: 'Fashion',
        meta_description: 'Fashion and clothing items'
      }
    });

    // Create subcategories for Electronics
    await prisma.subcategory.create({
      data: {
        name: 'Mobile Phones',
        slug: 'mobile-phones',
        categoryId: category1.id,
        meta_title: 'Mobile Phones',
        meta_description: 'Mobile phones and accessories'
      }
    });

    await prisma.subcategory.create({
      data: {
        name: 'Laptops',
        slug: 'laptops',
        categoryId: category1.id,
        meta_title: 'Laptops',
        meta_description: 'Laptops and notebooks'
      }
    });

    // Create subcategories for Fashion
    await prisma.subcategory.create({
      data: {
        name: "Men's Wear",
        slug: 'mens-wear',
        categoryId: category2.id,
        meta_title: "Men's Wear",
        meta_description: "Men's clothing and accessories"
      }
    });

    await prisma.subcategory.create({
      data: {
        name: "Women's Wear",
        slug: 'womens-wear',
        categoryId: category2.id,
        meta_title: "Women's Wear",
        meta_description: "Women's clothing and accessories"
      }
    });

    console.log('Initial categories and subcategories created successfully!');
  } catch (error) {
    console.error('Error creating initial data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();