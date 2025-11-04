import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

// Helper function to validate URL
function isValidUrl(string) {
  if (!string || string.trim() === '') return true; // Empty strings are valid
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Create social media links
export async function POST(request) {
  try {
    const data = await request.json();
    const { facebook, instagram, twitter, tiktok, pinterest } = data;
  
    // Validate URLs if provided
    const urls = { facebook, instagram, twitter, tiktok, pinterest };
    for (const [key, value] of Object.entries(urls)) {
      if (value && !isValidUrl(value)) {
        return NextResponse.json(
          { 
            message: `Invalid URL format for ${key}. Please provide a valid URL.`, 
            status: false 
          },
          { status: 400 }
        );
      }
    }

    // Check if at least one link is provided
    const hasAtLeastOneLink = Object.values(urls).some(url => url && url.trim() !== '');
    if (!hasAtLeastOneLink) {
      return NextResponse.json(
        { 
          message: 'Please provide at least one social media link.', 
          status: false 
        },
        { status: 400 }
      );
    }

        // Create a new record
        const newSocialMedia = await prisma.socialMedia.create({
          data: {
        facebook: facebook?.trim() || null,
        instagram: instagram?.trim() || null,
        twitter: twitter?.trim() || null,
        tiktok: tiktok?.trim() || null,
        pinterest: pinterest?.trim() || null,
          },
        });

    return NextResponse.json({ 
      status: true, 
      message: 'Social media links created successfully',
      data: newSocialMedia 
    });
    } catch (error) {
    console.error('Error creating social media links:', error);
      return NextResponse.json(
      { 
        message: 'Failed to create social media links', 
        status: false, 
        error: error.message 
      },
        { status: 500 }
      );
    }
  }
// Fetch social media links
// export async function GET() {
//   try {
//     const socialMedia = await prisma.socialMedia.findUnique({
//       where: { id: 1 }, // Assuming a single entry for social media links
//     });

//     if (!socialMedia) {
//       return NextResponse.json({ message: 'No social media links found', status: false }, { status: 404 });
//     }

//     return NextResponse.json({ status: true, data: socialMedia });
//   } catch (error) {
//     console.error('Error fetching social media links:', error);
//     return NextResponse.json({ message: 'Failed to fetch social media links', status: false, error: error.message }, { status: 500 });
//   }
// }



// Fetch all social media links
export async function GET() {
    try {
    const socialMediaLinks = await prisma.socialMedia.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      status: true, 
      data: socialMediaLinks || [],
      message: socialMediaLinks.length === 0 ? 'No social media links found' : 'Social media links fetched successfully'
    });
    } catch (error) {
      console.error('Error fetching social media links:', error);
      return NextResponse.json(
      { 
        message: 'Failed to fetch social media links', 
        status: false, 
        error: error.message 
      },
        { status: 500 }
      );
    }
  }
// Delete social media links (optional - for bulk delete if needed)
export async function DELETE() {
  try {
    // This endpoint is kept for backward compatibility but not recommended
    // Use DELETE /api/socialmedia/[id] for specific deletion
    return NextResponse.json(
      { 
        message: 'Please use DELETE /api/socialmedia/[id] to delete a specific entry', 
        status: false 
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error deleting social media links:', error);
    return NextResponse.json(
      { 
        message: 'Failed to delete social media links', 
        status: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
