import { query } from "./_generated/server";
import { v } from "convex/values";

export const checkToken = query({
  args: { email: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("token"), args.token))
      .filter((q) => q.eq(q.field("usedAt"), undefined))
      .first();

    if (!resetToken) {
      return { valid: false, error: "Código inválido" };
    }

    if (resetToken.expiresAt < Date.now()) {
      return { valid: false, error: "El código ha expirado" };
    }

    return { valid: true };
  },
});