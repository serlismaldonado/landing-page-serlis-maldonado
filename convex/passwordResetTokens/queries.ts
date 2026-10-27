import { query } from "../_generated/server";
import { v } from "convex/values";

export const getActiveTokens = query({
  args: { email: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("passwordResetTokens"),
      _creationTime: v.number(),
      email: v.string(),
      token: v.string(),
      expiresAt: v.number(),
      usedAt: v.optional(v.number()),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("usedAt"), undefined))
      .collect();
  },
});
