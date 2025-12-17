import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Create transporter based on environment
const createTransporter = (): Transporter | null => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && process.env.SMTP_HOST) {
    // Production: SendGrid/AWS SES/Custom SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD!,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    // Development/Production: Gmail (Explicit Configuration via Port 587)
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Must be false for port 587 (STARTTLS)
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Helps with potential cloud cert issues
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  } else {
    console.warn('⚠️  No email configuration found. Emails will not be sent.');
    return null;
  }
};

let transporter: Transporter | null = null;

try {
  transporter = createTransporter();
  if (transporter) {
    console.log('✅ Email service initialized');
  }
} catch (error) {
  console.error('❌ Failed to initialize email service:', error);
}

// Email templates with branded design
const emailTemplates = {
  verification: (name: string, verificationUrl: string) => ({
    subject: '🚗 Verify Your gadizone Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to gadizone!</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px; background: #ffffff;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Thank you for signing up! We're excited to have you join our community of car enthusiasts.
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Please verify your email address to activate your account and start exploring:
                    </p>
                    <!-- Button -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0;">
                      <strong>Note:</strong> This verification link will expire in 24 hours.
                    </p>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 16px 0 0 0;">
                      If you didn't create an account with gadizone, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      © ${new Date().getFullYear()} gadizone. All rights reserved.<br>
                      Your trusted source for car comparisons and insights.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  welcome: (name: string) => ({
    subject: '🎉 Welcome to gadizone - Your Account is Active!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎊 Welcome Aboard!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Your account is now verified and ready to use! 🚀
                    </p>
                    <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 16px 0;">
                      Here's what you can do now:
                    </p>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0; padding-left: 24px;">
                      <li><strong>Compare Cars:</strong> Side-by-side feature, price, and spec comparisons</li>
                      <li><strong>Calculate EMI:</strong> Get accurate loan estimates and on-road prices</li>
                      <li><strong>Save Favorites:</strong> Keep track of cars you're interested in</li>
                      <li><strong>Latest News:</strong> Stay updated with automotive industry trends</li>
                      <li><strong>Expert Reviews:</strong> Read detailed reviews and ratings</li>
                    </ul>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Start Exploring Cars
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0; text-align: center;">
                      Need help? Reply to this email or visit our help center.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      Happy car hunting!<br>
                      The gadizone Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: '🔐 Reset Your gadizone Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      We received a request to reset your password. Click the button below to create a new password:
                    </p>
                    <table role="presentation" style="margin: 0 auto 32px auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 0 0 24px 0;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⚠️ Security Notice:</strong><br>
                        This link will expire in 1 hour for your security.<br>
                        Never share this link with anyone.
                      </p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      © ${new Date().getFullYear()} gadizone. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  otpLogin: (name: string, otp: string) => ({
    subject: '🔐 Your gadizone Login Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Your Login Code</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi${name ? ` ${name}` : ''},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Use the following code to log in to your gadizone account:
                    </p>
                    <!-- OTP Code Display -->
                    <div style="background: #f9fafb; border: 2px dashed #dc2626; border-radius: 12px; padding: 24px; margin: 0 auto 32px auto; max-width: 280px;">
                      <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">${otp}</span>
                    </div>
                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; text-align: left; margin: 0 0 24px 0;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⏱️ This code expires in 5 minutes.</strong><br>
                        If you didn't request this code, please ignore this email.
                      </p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                      Never share this code with anyone. gadizone will never ask for your code.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      © ${new Date().getFullYear()} gadizone. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  welcomeLogin: (name: string) => ({
    subject: `👋 Welcome back to gadizone, ${name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">👋 Welcome Back!</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      You've successfully logged in to your gadizone account. 🎉
                    </p>
                    <p style="color: #111827; font-size: 18px; font-weight: bold; margin: 0 0 16px 0;">
                      What would you like to explore today?
                    </p>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 32px 0; padding-left: 24px;">
                      <li><strong>Compare Cars:</strong> Find your perfect match with side-by-side comparisons</li>
                      <li><strong>Latest Launches:</strong> Discover newly launched cars in India</li>
                      <li><strong>Calculate EMI:</strong> Plan your finances with our EMI calculator</li>
                      <li><strong>Expert Reviews:</strong> Read detailed car reviews and ratings</li>
                    </ul>
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Explore Cars Now
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 32px 0 0 0; text-align: center;">
                      If this wasn't you, please secure your account immediately.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                      Happy car hunting!<br>
                      The gadizone Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),
};

// Send email function with robust error handling
export const sendEmail = async (
  to: string,
  template: keyof typeof emailTemplates,
  data: { name: string; url?: string; otp?: string }
): Promise<{ success: boolean; error?: string }> => {
  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    console.error('❌ Invalid email address:', to);
    return { success: false, error: 'Invalid email address' };
  }

  if (!transporter) {
    console.error('❌ Email service not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    // Handle different template parameter types
    let emailContent;
    if (template === 'otpLogin') {
      emailContent = emailTemplates[template](data.name, data.otp || '');
    } else if (template === 'welcomeLogin' || template === 'welcome') {
      emailContent = emailTemplates[template](data.name);
    } else {
      emailContent = emailTemplates[template](data.name, data.url || '');
    }

    const from = process.env.GMAIL_USER || process.env.SMTP_USER || 'noreply@gadizone.com';

    await transporter.sendMail({
      from: `"gadizone" <${from}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`✅ Email sent successfully to ${to}: ${emailContent.subject}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Email send error:', error.message || error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

// Test email configuration
export const testEmailService = async (): Promise<boolean> => {
  if (!transporter) {
    console.error('❌ Email transporter not initialized');
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return true;
  } catch (error: any) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
};
