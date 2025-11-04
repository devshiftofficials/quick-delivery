import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.email', // Hostinger's SMTP server
      port: 587, // Secure port for SMTP over SSL
      secure: true, // Use SSL
      auth: {
        user: process.env.MAIL_USER, // Your Hostinger email address
        pass: process.env.MAIL_PASSWORD, // Your Hostinger email password
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
    
    const resetLink = `${baseUrl}/customer/pages/reset?token=${token}`;
    
    // Log for debugging (remove in production if needed)
    console.log('Reset password email - Using baseUrl:', baseUrl);
    console.log('Reset password email - Full link:', resetLink);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please reset your password by clicking the following link: ${resetLink}`,
      html: `<p>You requested a password reset. Please reset your password by clicking the following link: <a href="${resetLink}">Reset Password</a></p>`,
    };

    const ok = await transporter.sendMail(mailOptions);
    const result =ok.response;
    console.log("Response is : ",ok, "And result is : ",result);
    console.log('Password reset email sent successfully to ',email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
