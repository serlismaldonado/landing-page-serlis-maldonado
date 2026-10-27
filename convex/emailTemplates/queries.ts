import { v } from "convex/values";
import { query } from "../_generated/server";
import { emailTemplateType } from "./index";

const emailTemplateValidator = v.object({
  _id: v.id("emailTemplates"),
  _creationTime: v.number(),
  name: v.string(),
  subject: v.string(),
  content: v.string(),
  type: emailTemplateType,
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const list = query({
  args: { type: v.optional(emailTemplateType) },
  returns: v.array(emailTemplateValidator),
  handler: async (ctx, args) => {
    if (args.type) {
      const type = args.type;
      return await ctx.db
        .query("emailTemplates")
        .withIndex("by_type", (q) => q.eq("type", type))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("emailTemplates").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("emailTemplates") },
  returns: v.union(emailTemplateValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
