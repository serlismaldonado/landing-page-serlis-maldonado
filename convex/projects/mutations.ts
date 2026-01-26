import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { validatorProject } from "./index";
import { requireAuth } from "./queries";

// Create a new project
export const createProject = mutation({
  args: validatorProject,
  handler: async (ctx, args) => {
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

// Update a project
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
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    // Delete image from storage if exists
    if (project.imageId) {
      await ctx.storage.delete(project.imageId);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Upload project image
export const uploadProjectImage = mutation({
  args: {
    projectId: v.id("projects"),
    file: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      imageId: args.file,
      updatedAt: Date.now(),
    });
    return args.file;
  },
});

// Reorder projects
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
    for (const project of args.projects) {
      await ctx.db.patch(project.id, {
        order: project.order,
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});

// Toggle visibility
export const toggleVisibility = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
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
