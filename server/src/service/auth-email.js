import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_USER } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP configuration is incomplete");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
};

const escapeHtml = (value) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;",
      })[character],
  );

export const sendPasswordResetEmail = async ({ email, fullName, resetUrl }) => {
  const safeName = escapeHtml(fullName || "there");
  const safeResetUrl = escapeHtml(resetUrl);

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your Laxsik Ecolodge password",
    text: [
      `Hello ${fullName || "there"},`,
      "",
      "We received a request to reset your Laxsik Ecolodge password.",
      `Open this link within 15 minutes: ${resetUrl}`,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#193d3b;line-height:1.6;max-width:560px;margin:auto">
        <h1 style="font-size:24px">Reset your password</h1>
        <p>Hello ${safeName},</p>
        <p>We received a request to reset your Laxsik Ecolodge password.</p>
        <p style="margin:28px 0">
          <a href="${safeResetUrl}" style="background:#0d4949;color:#fff;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:700">
            Choose a new password
          </a>
        </p>
        <p>This link expires in 15 minutes. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};
