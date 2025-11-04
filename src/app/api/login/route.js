import prisma from '../../util/prisma'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request) {
  const data = await request.json();
  const { email, password } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: "User does not exist",
      }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({
        message: "Please verify your email before logging in.",
      }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        message: "Invalid Password",
      }, { status: 401 });
    }

    // Get user with vendor relation to include vendorId if user is a vendor
    const userWithVendor = await prisma.user.findUnique({
      where: { email },
      include: { vendor: true }
    });

    // Prepare token payload
    const tokenPayload = {
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role
    };

    // Add vendorId to token if user is a vendor
    if (user.role === 'VENDOR' && userWithVendor?.vendorId) {
      tokenPayload.vendorId = userWithVendor.vendorId;
    }

    // Generate JWT token
    const token = jwt.sign(tokenPayload, SECRET_KEY, {
      expiresIn: '1h' // token will expire in 1 hour
    });

    return NextResponse.json({
      success: true,
      message: "Login Successfully",
      token,
      user: { 
        email: user.email, 
        id: user.id,
        name: user.name, 
        role: user.role,
        vendorId: userWithVendor?.vendorId || null
      }, // Return the user details
    });
  } catch (error) {
    console.error('Error during login:', error);
    // Provide more specific error messages
    let errorMessage = 'An error occurred during login. Please try again.';
    
    if (error.message) {
      // Log full error for debugging but send safe message to client
      console.error('Full login error:', error);
      errorMessage = 'Login failed. Please check your credentials and try again.';
    }
    
    return NextResponse.json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}
