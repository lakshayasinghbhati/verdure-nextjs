import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const info = await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to,
  subject,
  html,
});

console.log("EMAIL SENT TO:", to);
console.log("EMAIL ENVELOPE:", info.envelope);
console.log("MESSAGE ID:", info.messageId);
}