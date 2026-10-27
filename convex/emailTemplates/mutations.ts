import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { emailTemplateType } from "./index";

export const create = mutation({
  args: {
    name: v.string(),
    subject: v.string(),
    content: v.string(),
    type: emailTemplateType,
  },
  returns: v.id("emailTemplates"),
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("emailTemplates", {
      name: args.name,
      subject: args.subject,
      content: args.content,
      type: args.type,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("emailTemplates"),
    name: v.optional(v.string()),
    subject: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(emailTemplateType),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Template not found");
    }
    await ctx.db.patch(args.id, {
      ...(args.name && { name: args.name }),
      ...(args.subject && { subject: args.subject }),
      ...(args.content && { content: args.content }),
      ...(args.type && { type: args.type }),
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("emailTemplates") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
