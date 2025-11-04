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

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/customer/pages/verify?token=${token}`;
    
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
