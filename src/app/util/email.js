import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Ensure this is correct
    port: 587, // Use the correct port for non-secure connections
    secure: false, // Set to true if you switch to port 465 (SSL)
    auth: {
      user: 'qasimali09810@gmail.com', // Your email
      pass: 'dlji kvee otno hwcq', // Your email password
    },
  });

  // Use BASE_URL from environment variable, or auto-detect from Vercel/deployment
  // Priority: BASE_URL > VERCEL_URL > NEXT_PUBLIC_BASE_URL > localhost
  let baseUrl = process.env.BASE_URL;
  
  if (!baseUrl) {
    // Auto-detect Vercel URL
    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      // Fallback to localhost only in development
      baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://quick-delivery2.vercel.app' 
        : 'http://localhost:3000';
    }
  }
  
  const verificationLink = `${baseUrl}/api/verify/${token}`;


  const mailOptions = {
    from: 'qasimali09810@gmail.com',
    to: email,
    subject: 'Verify Your Email Address',
    html: `<p>Thank you for registering. Please click the link below to verify your email address:</p><a href="${verificationLink}">Verify Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}
