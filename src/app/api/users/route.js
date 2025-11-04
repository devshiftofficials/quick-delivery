import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../../util/sendVerificationEmail';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, password, phoneno, city, role, imageUrl } = data;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required.', status: false },
        { status: 400 }
      );
    }

    // Validate role - only allow CUSTOMER or VENDOR (ADMIN should be created separately)
    if (!role || (role !== 'CUSTOMER' && role !== 'VENDOR')) {
      return NextResponse.json(
        { message: 'Invalid role. Please select either Customer or Vendor.', status: false },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.', status: false },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long.', status: false },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered. Please use a different email.', status: false },
        { status: 400 }
      );
    }

    // Hash the user's password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate a verification token and expiration date
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

    // Start a transaction to ensure data consistency
    const newUser = await prisma.$transaction(async (tx) => {
      let vendor = null;
      if (role === "VENDOR") {
        // Generate a unique slug
        let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let slug = baseSlug;
        let counter = 1;
        
        // Check if slug exists and make it unique
        while (await tx.vendor.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        // Create a vendor profile first
        try {
          vendor = await tx.vendor.create({
            data: {
              name: name,
              email: email || null,
              phone: phoneno || null,
              slug: slug,
              status: "active",
              description: "", // Optional vendor description
              address: city || null // Use city as initial address
            }
          });
        } catch (vendorError) {
          console.error('Error creating vendor:', vendorError);
          throw new Error(`Failed to create vendor profile: ${vendorError.message}`);
        }
      }

      // Create the user with vendor association if applicable
      const userData = {
        name,
        email,
        password: hashedPassword,
        phoneno: phoneno || null,
        city: city || null,
        role,
        imageUrl: imageUrl || null,
        verificationToken,
        verificationTokenExpires,
        emailVerified: false,
        ...(vendor && { vendorId: vendor.id }) // Only add vendorId if vendor was created
      };

      try {
        return await tx.user.create({
          data: userData,
          include: {
            vendor: true // Include vendor details in the response
          }
        });
      } catch (userError) {
        console.error('Error creating user:', userError);
        throw new Error(`Failed to create user: ${userError.message}`);
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: 'User registered successfully. Please check your email to verify your account.',
      status: true,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create account. Please try again.';
    
    if (error.message.includes('vendor')) {
      errorMessage = error.message;
    } else if (error.message.includes('user')) {
      errorMessage = error.message;
    } else if (error.message.includes('Unique constraint')) {
      errorMessage = 'An account with this information already exists. Please use different details.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      {
        message: errorMessage,
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    console.log('Fetched users:', users);  // Add logging here
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch users',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
