import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("Email credentials not configured. Email not sent.");
      return { success: false, error: "Email not configured" };
    }

    const info = await transporter.sendMail({
      from: `"Mercan Auto Parts" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e3703b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #e3703b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your Mercan Auto Parts account.</p>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>For security, this link will only work once and will expire in 1 hour.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Mercan Auto Parts. All rights reserved.</p>
          <p>Bungoma Road, off Bunyala Road, Nairobi, Kenya</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Password Reset Request - Mercan Auto Parts",
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e3703b; color: white; padding: 30px 20px; text-align: center; }
        .logo { width: 80px; height: 80px; margin: 0 auto 15px; }
        .content { padding: 30px 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #e3703b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .features { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-item { margin: 15px 0; padding-left: 25px; position: relative; }
        .feature-item:before { content: "✓"; position: absolute; left: 0; color: #e3703b; font-weight: bold; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo" style="background-color: white; border-radius: 50%; display: flex; align-items: center; justify-center; width: 80px; height: 80px;">
            <span style="font-size: 24px; font-weight: bold; color: #e3703b;">M</span>
          </div>
          <h1 style="margin: 0;">Welcome to Mercan Auto Parts!</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for creating an account with Mercan Auto Parts. We're excited to have you join our community!</p>

          <div class="features">
            <h3 style="color: #e3703b; margin-top: 0;">What you can do:</h3>
            <div class="feature-item">Browse thousands of premium auto parts and accessories</div>
            <div class="feature-item">Book professional service appointments online</div>
            <div class="feature-item">Track your orders and service history</div>
            <div class="feature-item">Get exclusive deals and notifications</div>
            <div class="feature-item">Manage your account preferences</div>
          </div>

          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/shop" class="button">Start Shopping</a>
          </p>

          <p>If you have any questions, our support team is here to help!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Mercan Auto Parts. All rights reserved.</p>
          <p>Bungoma Road, off Bunyala Road, Nairobi, Kenya</p>
          <p>Phone: 0741000000 | Email: info@mercan.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Mercan Auto Parts! 🚗",
    html,
  });
}

export async function sendLoginNotification(email: string, name: string, loginDetails: { ip?: string; userAgent?: string; timestamp: Date }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e3703b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .info-box { background-color: white; padding: 15px; border-left: 4px solid #e3703b; margin: 15px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Login Detected</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>We detected a new login to your Mercan Auto Parts account.</p>
          <div class="info-box">
            <p><strong>Login Details:</strong></p>
            <p><strong>Time:</strong> ${loginDetails.timestamp.toLocaleString()}</p>
            ${loginDetails.ip ? `<p><strong>IP Address:</strong> ${loginDetails.ip}</p>` : ""}
            ${loginDetails.userAgent ? `<p><strong>Device:</strong> ${loginDetails.userAgent}</p>` : ""}
          </div>
          <p>If this was you, you can safely ignore this email.</p>
          <p>If you didn't log in, please secure your account immediately by changing your password.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Mercan Auto Parts. All rights reserved.</p>
          <p>Bungoma Road, off Bunyala Road, Nairobi, Kenya</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "New Login to Your Account - Mercan Auto Parts",
    html,
  });
}
