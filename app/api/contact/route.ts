import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const providers = {
  gmail: {
    host: process.env.GMAIL_HOST,
    port: Number(process.env.GMAIL_PORT),
    secure: process.env.GMAIL_SECURE === "true",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // استخدم App Password لـ Gmail
    },
  },
  // إزالة Outlook لأنه لا يعمل مع Basic Auth
};

// 🔍 دالة تحديد البروفايدر من الدومين
function detectProvider(email: string): keyof typeof providers | null {
  const domain = email.split("@")[1]?.toLowerCase();
  console.log("Detected domain:", domain);

  if (!domain) return null;

  if (domain.includes("gmail")) return "gmail";
  
  // Outlook domains - سيتم رفضها
  if (
    domain.includes("outlook") ||
    domain.includes("hotmail") ||
    domain.includes("live")
  ) {
    return null; // لا نقبل Outlook
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { from, to, message } = await req.json();

    if (!from || !to || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // فحص إذا كان البريد من Outlook
    const domain = from.split("@")[1]?.toLowerCase();
    if (
      domain?.includes("outlook") ||
      domain?.includes("hotmail") ||
      domain?.includes("live")
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Outlook/Hotmail emails are currently not supported due to security restrictions. Please use Gmail or another email provider.",
          unsupported_provider: true
        },
        { status: 400 }
      );
    }

    // تحديد البروفايدر
    const provider = detectProvider(from);
    if (!provider) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email provider not supported. Currently we only support Gmail.",
          unsupported_provider: true
        },
        { status: 400 }
      );
    }

    // إعداد الـ transporter
    const transporter = nodemailer.createTransport(providers[provider]);

    // إرسال الإيميل الرئيسي
    await transporter.sendMail({
      to,
      from: providers[provider].auth.user, // استخدم Gmail المعتمد للإرسال
      replyTo: from, // المستخدم يقدر يرد على البريد الأصلي
      subject: `Contact Message from ${from}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
            New Contact Message
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${from}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            This message was sent through your website contact form.
          </p>
        </div>
      `,
    });

    // إرسال تأكيد للمستخدم (فقط إذا كان Gmail)
    if (provider === "gmail") {
      try {
        await transporter.sendMail({
          to: from,
          from: providers[provider].auth.user,
          subject: "Message Received Successfully ✅",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #27ae60;">Thank You for Contacting Us!</h2>
              <p>We have successfully received your message:</p>
              <div style="background: #f1f2f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <em>"${message}"</em>
              </div>
              <p>We will get back to you as soon as possible.</p>
              <p style="color: #666; font-size: 12px;">
                Best regards,<br>
                Your Website Team
              </p>
            </div>
          `,
        });
      } catch (confirmError) {
        console.log("Confirmation email failed:", confirmError);
        // لا نفشل العملية كلها لو فشل إيميل التأكيد
      }
    }

    return NextResponse.json({ 
      success: true, 
      provider,
      message: "Message sent successfully!"
    });

  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}