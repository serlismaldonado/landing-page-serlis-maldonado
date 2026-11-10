import { query, QueryCtx, MutationCtx } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../auth";

// ============================================
// HELPER: Verificar usuario autenticado
// ============================================

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  return requireAdmin(ctx);
}

// ============================================
// QUERIES
// ============================================

export const getAllProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("desc")
      .collect();
  },
});

export const getProjectsByCategory = query({
  args: { category: v.union(v.literal("proyecto"), v.literal("blog")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("visibility"), "public"))
      .collect();
  },
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    let coverUrl: string | null = null;
    if (project.cover) {
      coverUrl = await ctx.storage.getUrl(project.cover);
    }

    const imageUrls = await Promise.all(
      (project.images || []).map((imageId) => ctx.storage.getUrl(imageId)),
    );

    return { ...project, coverUrl, imageUrls };
  },
});

export const getPublicProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project || project.visibility !== "public") return null;

    let coverUrl: string | null = null;
    if (project.cover) {
      coverUrl = await ctx.storage.getUrl(project.cover);
    }

    const imageUrls = await Promise.all(
      (project.images || []).map((imageId) => ctx.storage.getUrl(imageId)),
    );

    return { ...project, coverUrl, imageUrls };
  },
});

export const getProjectsWithImages = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();

    return Promise.all(
      projects.map(async (project) => {
        let coverUrl: string | null = null;
        if (project.cover) {
          coverUrl = await ctx.storage.getUrl(project.cover);
        }

        const imageUrls = await Promise.all(
          (project.images || []).map((imageId) => ctx.storage.getUrl(imageId)),
        );
        return { ...project, coverUrl, imageUrls };
      }),
    );
  },
});

export const searchProjects = query({
  args: {
    search: v.string(),
    category: v.optional(v.union(v.literal("proyecto"), v.literal("blog"))),
  },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query("projects")
      .withSearchIndex("search_projects", (q) => {
        let query = q.search("title", args.search);
        if (args.category) {
          query = query.eq("category", args.category);
        }
        return query;
      });
    const results = await q.collect();
    return results.filter((p) => p.visibility === "public");
  },
});

export const getFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("asc")
      .take(6);
  },
});

export const getProjectsCount = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();
    return projects.length;
  },
});

export const getContributionProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) =>
        q.and(
          q.gt(q.field("intensity"), 0),
          q.eq(q.field("visibility"), "public"),
        ),
      )
      .collect();

    return projects.map((project) => ({
      title: project.title,
      date: project.date,
      intensity: project.intensity,
      tags: project.tags,
      url: project.url,
      description: project.description,
    }));
  },
});

// Admin queries
export const getAllProjectsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.db.query("projects").order("desc").collect();
  },
});

export const getProjectAdmin = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    let coverUrl: string | null = null;
    if (project.cover) {
      coverUrl = await ctx.storage.getUrl(project.cover);
    }

    const imageUrls = await Promise.all(
      (project.images || []).map((imageId) => ctx.storage.getUrl(imageId)),
    );

    return { ...project, coverUrl, imageUrls };
  },
});

export const getProjectsCountAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    const projects = await ctx.db.query("projects").collect();
    return {
      total: projects.length,
      public: projects.filter((p) => p.visibility === "public").length,
      private: projects.filter((p) => p.visibility === "private").length,
    };
  },
});

export const getCoverImages = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();

    const coverUrls = await Promise.all(
      projects
        .filter((p) => p.cover)
        .map(async (project) => {
          const url = await ctx.storage.getUrl(project.cover!);
          return url;
        }),
    );

    return coverUrls.filter((url): url is string => !!url);
  },
});
