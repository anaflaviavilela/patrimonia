// backend/src/lib/mailer.js

import nodemailer from "nodemailer";

const port = Number(process.env.EMAIL_PORT) || 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.resend.com",
  port,
  secure: port === 465, // true na porta 465 para SSL implícito do Resend
  auth: {
    user: process.env.EMAIL_USER || "resend",
    pass: process.env.EMAIL_PASS || "",
  },
});

export async function sendEmail({ to, subject, html }) {
  console.log(`[mailer] A enviar e-mail real para ${to} via Resend...`);
  
  try {
    const info = await transporter.sendMail({
      from: `"Patrimônia 2.0" <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`,
      to,
      subject,
      html,
    });
    console.log("[mailer] E-mail entregue com sucesso pelo Resend! ID:", info.messageId);
  } catch (error) {
    console.error("[mailer] ERRO AO ENVIAR VIA RESEND:", error);
    throw error;
  }
}