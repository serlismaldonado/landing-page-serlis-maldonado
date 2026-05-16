import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { components } from "../_generated/api";

export const _listTokens = internalQuery({
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
      .collect();
  },
});

export const _createToken = internalMutation({
  args: {
    email: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("passwordResetTokens", {
      email: args.email,
      token: args.token,
      expiresAt: args.expiresAt,
    });
  },
});

export const _markUsed = internalMutation({
  args: { id: v.id("passwordResetTokens") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      usedAt: Date.now(),
    });
  },
});

export const _findAccountByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.union(
    v.object({
      _id: v.string(),
      userId: v.string(),
      password: v.union(v.string(), v.null()),
      providerId: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "email", operator: "eq", value: args.email }],
    });

    if (!user) return null;

    const account = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "account",
      where: [
        { field: "userId", operator: "eq", value: user._id },
        { field: "providerId", operator: "eq", value: "credential" },
      ],
    });

    if (!account) return null;

    return {
      _id: account._id,
      userId: account.userId,
      password: account.password ?? null,
      providerId: account.providerId,
    };
  },
});

export const _updateAccountPassword = internalMutation({
  args: {
    accountId: v.string(),
    password: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "account",
        where: [{ field: "_id", operator: "eq", value: args.accountId }],
        update: { password: args.password },
      },
    });
  },
});
