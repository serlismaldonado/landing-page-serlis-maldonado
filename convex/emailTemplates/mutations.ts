import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { emailTemplates, emailTemplateType } from "./schema";

export const create = mutation({
  args: {
    name: v.string(),
    subject: v.string(),
    content: v.string(),
    type: emailTemplateType,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("emailTemplates", {
      name: args.name,
      subject: args.subject,
      content: args.content,
      type: args.type,
      createdAt: now,
      updatedAt: now,
    });
    return id;
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
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});