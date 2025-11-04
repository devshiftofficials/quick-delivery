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

    // Use BASE_URL from environment variable, or fallback to localhost for development
    // For Vercel: Set BASE_URL=https://quick-delivery2.vercel.app in environment variables
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/customer/pages/reset?token=${token}`;

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
