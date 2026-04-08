import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { validatorProject } from "./index";
import { requireAuth } from "./queries";

// Create a new project
export const createProject = mutation({
  args: validatorProject,
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      ...args,
      visibility: args.visibility ?? "public",
      order: args.order ?? 0,
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
    images: v.optional(v.array(v.id("_storage"))),
    category: v.optional(v.union(v.literal("proyecto"), v.literal("blog"))),
    tags: v.optional(v.array(v.string())),
    intensity: v.optional(v.float64()),
    date: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    order: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
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

    if (project.images && project.images.length > 0) {
      for (const imageId of project.images) {
        await ctx.storage.delete(imageId);
      }
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
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const currentImages = project.images || [];
    const updatedImages = [...currentImages, args.file];

    await ctx.db.patch(args.projectId, {
      images: updatedImages,
    });

    return args.file;
  },
});

// Delete a specific image from a project
export const deleteProjectImage = mutation({
  args: {
    projectId: v.id("projects"),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const updatedImages = (project.images || []).filter(
      (id) => id !== args.imageId,
    );

    await ctx.storage.delete(args.imageId);
    await ctx.db.patch(args.projectId, {
      images: updatedImages,
    });

    return { success: true };
  },
});

// Reorder projects
export const reorderProjects = mutation({
  args: {
    projects: v.array(
      v.object({
        id: v.id("projects"),
        order: v.float64(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const project of args.projects) {
      await ctx.db.patch(project.id, {
        order: project.order,
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

    if (project.images && project.images.length > 0) {
      for (const imageId of project.images) {
        await ctx.storage.delete(imageId);
      }
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
      if (project?.images && project.images.length > 0) {
        for (const imageId of project.images) {
          await ctx.storage.delete(imageId);
        }
      }
      await ctx.db.delete(id);
    }
    return { success: true, count: args.ids.length };
  },
});
