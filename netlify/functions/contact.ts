import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

function getEmailTransport() {
  const host = process.env.SMTP_HOST || "";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    console.log("⚠️ SMTP configuration is incomplete. Email notifications will be logged to console.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée. Utilisez POST." }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Veuillez remplir tous les champs obligatoires (nom, email, message)." }),
      };
    }

    const targetEmail = process.env.SUPPORT_EMAIL || "sillyfr079@gmail.com";
    console.log(`[Support Contact] Message received from ${name} (${email}) to ${targetEmail}`);

    const transport = getEmailTransport();
    const mailOptions = {
      from: process.env.SMTP_USER || `"CouponCheck Pro Support" <noreply@example.com>`,
      to: targetEmail,
      subject: `[Support Contact] ${subject || "Nouveau message"}`,
      html: `
        <h2>Nouveau contact de support de ${name}</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject || "Sans sujet"}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f7f7f9; padding: 15px; border-left: 4px solid #6c63ff; white-space: pre-wrap;">${message}</div>
      `,
    };

    if (transport) {
      await transport.sendMail(mailOptions);
      console.log("✅ Contact email sent successfully via SMTP.");
    } else {
      console.log("ℹ️ Simulated email delivery active. Payload received:");
      console.log(JSON.stringify({ to: targetEmail, subject, name, email }, null, 2));
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true, message: "Votre demande de support a été envoyée avec succès." }),
    };
  } catch (error: any) {
    console.error("Error in support contact function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Une erreur est survenue lors de l'envoi du message: " + error.message }),
    };
  }
};
