"use node";

import { action } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { Resend } from "resend";
import { internal } from "../_generated/api";
import { hashPassword } from "better-auth/crypto";

function generateOTP(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const requestReset = action({
  args: { email: v.string() },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new ConvexError("No se pudo enviar el email. Intentá más tarde.");
    }

    const resend = new Resend(apiKey);
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    await ctx.runMutation(internal.passwordResetTokens.internal._createToken, {
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

    const emailResult = await resend.emails.send({
      from: "Serlis <hola@serlismaldonado.com>",
      to: args.email,
      subject: "Código para restablecer contraseña",
      html,
    });

    if (emailResult.error || !emailResult.data) {
      throw new ConvexError("No se pudo enviar el email. Intentá más tarde.");
    }

    return {
      success: true,
      message: "Si el email existe, recibirás un código",
    };
  },
});

export const verifyCode = action({
  args: {
    email: v.string(),
    token: v.string(),
  },
  returns: v.object({
    valid: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const tokens = await ctx.runQuery(
      internal.passwordResetTokens.internal._listTokens,
      { email: args.email },
    );

    const resetToken = tokens.find((t) => t.token === args.token && !t.usedAt);

    if (!resetToken) {
      return { valid: false, error: "Código inválido o expirado" };
    }

    if (resetToken.expiresAt < Date.now()) {
      await ctx.runMutation(internal.passwordResetTokens.internal._markUsed, {
        id: resetToken._id,
      });
      return { valid: false, error: "El código ha expirado" };
    }

    return { valid: true };
  },
});

export const verifyAndReset = action({
  args: {
    email: v.string(),
    token: v.string(),
    newPassword: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
    message: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    if (args.newPassword.length < 8) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 8 caracteres",
      };
    }

    const tokens = await ctx.runQuery(
      internal.passwordResetTokens.internal._listTokens,
      { email: args.email },
    );

    const resetToken = tokens.find((t) => t.token === args.token && !t.usedAt);

    if (!resetToken) {
      return { success: false, error: "Código inválido o expirado" };
    }

    if (resetToken.expiresAt < Date.now()) {
      await ctx.runMutation(internal.passwordResetTokens.internal._markUsed, {
        id: resetToken._id,
      });
      return { success: false, error: "El código ha expirado" };
    }

    const account: {
      _id: string;
      userId: string;
      password?: string | null;
      providerId: string;
    } | null = await ctx.runQuery(
      internal.passwordResetTokens.internal._findAccountByEmail,
      { email: args.email },
    );

    if (!account) {
      return {
        success: false,
        error: "No se encontró una cuenta para este email",
      };
    }

    const hashedPassword = await hashPassword(args.newPassword);

    await ctx.runMutation(
      internal.passwordResetTokens.internal._updateAccountPassword,
      {
        accountId: account._id,
        password: hashedPassword,
      },
    );

    await ctx.runMutation(internal.passwordResetTokens.internal._markUsed, {
      id: resetToken._id,
    });

    return { success: true, message: "Contraseña actualizada" };
  },
});
