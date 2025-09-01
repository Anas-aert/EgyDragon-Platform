import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


export async function POST(req: Request) {
  try {
    const { from, to, message } = await req.json();

    // إعداد الإيميل (استخدم Gmail أو أي SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // ايميلك
        pass: process.env.SMTP_PASS, // الباسورد / App Password
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject: "New Contact Message",
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
