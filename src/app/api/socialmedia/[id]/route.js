import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma'; // Adjust the path based on your project structure

// Fetch social media links by ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const socialMedia = await prisma.socialMedia.findUnique({
      where: { id: parseInt(id) }, // Ensure ID is treated as a number
    });

    if (!socialMedia) {
      return NextResponse.json({ message: 'No social media links found for the given ID', status: false }, { status: 404 });
    }

    return NextResponse.json({ status: true, data: socialMedia });
  } catch (error) {
    console.error(`Error fetching social media links for ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch social media links', status: false, error: error.message }, { status: 500 });
  }
}

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

// Update social media links by ID
export async function PUT(request, { params }) {
    const { id } = params;
  
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

    // Check if record exists
    const existingRecord = await prisma.socialMedia.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { 
          message: 'Social media entry not found', 
          status: false 
        },
        { status: 404 }
        );
      }
  
      const updatedSocialMedia = await prisma.socialMedia.update({
      where: { id: parseInt(id, 10) },
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
        message: 'Social media links updated successfully',
        data: updatedSocialMedia,
      });
    } catch (error) {
      console.error(`Error updating social media links for ID ${id}:`, error);
      return NextResponse.json(
      { 
        message: 'Failed to update social media links', 
        status: false, 
        error: error.message 
      },
        { status: 500 }
      );
    }
  }

// Delete social media links by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const deletedSocialMedia = await prisma.socialMedia.delete({
      where: { id: parseInt(id) }, // Ensure ID is treated as a number
    });
    return NextResponse.json({ status: true, message: 'Social media links deleted successfully', data: deletedSocialMedia });
  } catch (error) {
    console.error(`Error deleting social media links for ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete social media links', status: false, error: error.message }, { status: 500 });
  }
}
