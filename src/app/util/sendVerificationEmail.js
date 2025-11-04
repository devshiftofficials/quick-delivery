import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false, // For Gmail, secure should be false when using port 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Use BASE_URL from environment variable, or auto-detect from Vercel/deployment
    // Priority: BASE_URL > VERCEL_URL > NEXT_PUBLIC_BASE_URL > production URL > localhost
    let baseUrl = process.env.BASE_URL;
    
    if (!baseUrl) {
      // Auto-detect Vercel URL (Vercel automatically provides this)
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else if (process.env.NEXT_PUBLIC_BASE_URL) {
        baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      } else {
        // Fallback based on environment
        baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://quick-delivery2.vercel.app' 
          : 'http://localhost:3000';
      }
    }
    
    // Ensure baseUrl doesn't have trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const verificationLink = `${baseUrl}/customer/pages/verify?token=${token}`;
    
    // Log for debugging (remove in production if needed)
    console.log('Verification email - Using baseUrl:', baseUrl);
    console.log('Verification email - Full link:', verificationLink);
    
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationLink}`,
      html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
