import { defineTable } from "convex/server";
import { v } from "convex/values";

export const passwordResetTokens = defineTable({
  email: v.string(),
  token: v.string(),
  expiresAt: v.number(),
  usedAt: v.optional(v.number()),
})
  .index("by_email", ["email"])
  .index("by_token", ["token"]);
