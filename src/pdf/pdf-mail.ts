import nodemailer from 'nodemailer';
import { readPDFFile } from './file-service';

export async function sendPDFEmail(email: string, subject: string, message: string, pdfPath: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const pdfBuffer = await readPDFFile(pdfPath);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: message,
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
