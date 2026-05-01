import { v } from "convex/values";
import { query } from "./_generated/server";
import { emailTemplates } from "./schema";

export const list = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("emailTemplates")
        .withIndex("by_type", (q) => q.eq("type", args.type as any))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("emailTemplates")
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("emailTemplates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});