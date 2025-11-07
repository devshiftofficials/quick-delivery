import prisma from "../../../util/prisma";
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // First, try to get products explicitly marked as top rated
        const explicitlyTopRated = await prisma.product.findMany({
            where: { 
                isTopRated: true,
                stock: {
                    gt: 0 // Only products with stock > 0
                }
            },
            include: {
                images: true, // Include related images
                vendor: true, // Include vendor details
                subcategory: {
                    include: {
                        category: true, // Include category details
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Order by newest first
            },
        });

        // Filter products that have at least one image
        const filteredTopRated = explicitlyTopRated.filter(product => 
            product.images && product.images.length > 0
        );

        // If we have fewer than 10 top-rated products, supplement with recent products with discounts or newly created products
        if (filteredTopRated.length < 10) {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const existingTopRatedIds = filteredTopRated.map(p => p.id);
            
            // Get recent products that aren't already in top rated list
            const recentProducts = await prisma.product.findMany({
                where: {
                    stock: {
                        gt: 0 // Only products with stock > 0
                    },
                    OR: [
                        { isTopRated: false }, // Products not marked as top rated
                        { isTopRated: null }   // Products with null isTopRated
                    ],
                    AND: [
                        {
                            OR: [
                                { discount: { gt: 0 } }, // Products with discount
                                { createdAt: { gte: thirtyDaysAgo } } // Products created in last 30 days
                            ]
                        }
                    ]
                },
                include: {
                    images: true,
                    vendor: true,
                    subcategory: {
                        include: {
                            category: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc', // Order by newest first
                },
                take: 20 - filteredTopRated.length, // Fill up to 20 total products
            });

            // Filter recent products that have images
            const filteredRecent = recentProducts.filter(product => 
                product.images && product.images.length > 0
            );

            // Combine and remove duplicates based on product id
            const combinedProducts = [...filteredTopRated];
            const existingIds = new Set(filteredTopRated.map(p => p.id));
            
            filteredRecent.forEach(product => {
                if (!existingIds.has(product.id)) {
                    combinedProducts.push(product);
                }
            });

            // Limit to 20 products total
            const topRatedProducts = combinedProducts.slice(0, 20);

            return NextResponse.json({ data: topRatedProducts, status: true }, { status: 200 });
        }

        // If we have enough top-rated products, just return them (limited to 20)
        const topRatedProducts = filteredTopRated.slice(0, 20);

        return NextResponse.json({ data: topRatedProducts, status: true }, { status: 200 });
    } catch (error) {
        console.error('Error fetching top-rated products:', error);
        return NextResponse.json({ message: 'Failed to fetch top-rated products', error: error.message, status: false }, { status: 500 });
    }
}
