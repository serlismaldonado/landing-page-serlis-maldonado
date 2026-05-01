import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { passwordResetTokens } from "./schema";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
  return randomBytes(3).toString("hex").toUpperCase();
}

export const requestReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("accounts")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      return { success: true, message: "Si el email existe, recibirás un código" };
    }

    const existingTokens = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("usedAt"), undefined))
      .collect();

    for (const token of existingTokens) {
      await ctx.db.delete(token._id);
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await ctx.db.insert("passwordResetTokens", {
      email: args.email,
      token: otp,
      expiresAt,
    });

    const html = `
      <div style="background:#0a0a0a;color:#ededed;font-family:monospace;padding:32px;max-width:600px;margin:0 auto;">
        <h1 style="color:#22c55e;margin:0 0 24px 0;font-size:24px;">Código de verificación</h1>
        <p style="font-size:16px;line-height:1.6;">Tu código para restablecer tu contraseña es:</p>
        <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#22c55e;">${otp}</span>
        </div>
        <p style="font-size:14px;color:#71717a;">Este código expira en 10 minutos. Si no solicitaste un restablecimiento de contraseña, podés ignorar este email.</p>
      </div>
    `;

    await resend.emails.send({
      from: "Serlis <hola@serlismaldonado.com>",
      to: args.email,
      subject: "Código para restablecer contraseña",
      html,
    });

    return { success: true, message: "Si el email existe, recibirás un código" };
  },
});

export const verifyAndReset = mutation({
  args: {
    email: v.string(),
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.newPassword.length < 8) {
      return { success: false, error: "La contraseña debe tener al menos 8 caracteres" };
    }

    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("token"), args.token))
      .filter((q) => q.eq(q.field("usedAt"), undefined))
      .first();

    if (!resetToken) {
      return { success: false, error: "Código inválido o expirado" };
    }

    if (resetToken.expiresAt < Date.now()) {
      await ctx.db.delete(resetToken._id);
      return { success: false, error: "El código ha expirado" };
    }

    const account = await ctx.db
      .query("accounts")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!account) {
      return { success: false, error: "Usuario no encontrado" };
    }

    await ctx.db.patch(account._id, {
      password: args.newPassword,
    });

    await ctx.db.patch(resetToken._id, {
      usedAt: Date.now(),
    });

    return { success: true };
  },
});