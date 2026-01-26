import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth";

// ============================================
// HELPER: Verificar usuario autenticado
// ============================================

async function requireAuth(ctx: any) {
  const user = await authComponent.getAuthUser(ctx);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}

// ============================================
// PUBLIC QUERIES (No requieren autenticación)
// ============================================

export const getAllProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("asc")
      .collect();
  },
});

export const getProjectsByCategory = query({
  args: { category: v.union(v.literal("proyecto"), v.literal("blog")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    let imageUrl: string | null = null;
    if (project.imageId) {
      imageUrl = await ctx.storage.getUrl(project.imageId);
    }

    return { ...project, imageUrl };
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
        let imageUrl: string | null = null;
        if (project.imageId) {
          imageUrl = await ctx.storage.getUrl(project.imageId);
        }
        return { ...project, imageUrl };
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
    let q = ctx.db.query("projects").withSearchIndex("search_projects", (q) => {
      let query = q.search("title", args.search);
      if (args.category) {
        query = query.eq("category", args.category);
      }
      return query;
    });
    return await q.collect();
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
      .filter((q) => q.gt(q.field("intensity"), 0))
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

// ============================================
// AUTHENTICATED QUERIES
// ============================================

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

    let imageUrl: string | null = null;
    if (project.imageId) {
      imageUrl = await ctx.storage.getUrl(project.imageId);
    }

    return { ...project, imageUrl };
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

// ============================================
// AUTHENTICATED MUTATIONS
// ============================================

export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    category: v.union(v.literal("proyecto"), v.literal("blog")),
    tags: v.array(v.string()),
    intensity: v.optional(v.number()),
    date: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      ...args,
      visibility: args.visibility ?? "public",
      order: args.order ?? 0,
      createdAt: now,
      updatedAt: now,
    });
    return projectId;
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    category: v.optional(v.union(v.literal("proyecto"), v.literal("blog"))),
    tags: v.optional(v.array(v.string())),
    intensity: v.optional(v.number()),
    date: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.imageId) {
      await ctx.storage.delete(project.imageId);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const uploadProjectImage = mutation({
  args: {
    projectId: v.id("projects"),
    file: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.patch(args.projectId, {
      imageId: args.file,
      updatedAt: Date.now(),
    });
    return args.file;
  },
});

export const reorderProjects = mutation({
  args: {
    projects: v.array(
      v.object({
        id: v.id("projects"),
        order: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    for (const project of args.projects) {
      await ctx.db.patch(project.id, {
        order: project.order,
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});

export const toggleVisibility = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    const newVisibility =
      project.visibility === "public" ? "private" : "public";
    await ctx.db.patch(args.id, {
      visibility: newVisibility,
      updatedAt: Date.now(),
    });
    return newVisibility;
  },
});

// ============================================
// SUPER ADMIN ONLY
// ============================================

export const deleteProjectAdmin = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.imageId) {
      await ctx.storage.delete(project.imageId);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const bulkDeleteProjects = mutation({
  args: { ids: v.array(v.id("projects")) },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    for (const id of args.ids) {
      const project = await ctx.db.get(id);
      if (project?.imageId) {
        await ctx.storage.delete(project.imageId);
      }
      await ctx.db.delete(id);
    }
    return { success: true, count: args.ids.length };
  },
});
