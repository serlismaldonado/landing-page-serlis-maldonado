import { query } from "../_generated/server";
import { v } from "convex/values";

// Get all public projects
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

// Get projects by category
export const getProjectsByCategory = query({
  args: { category: v.union(v.literal("proyecto"), v.literal("blog")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get single project by ID
export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    // Get image URL if exists
    let imageUrl: string | null = null;
    if (project.imageId) {
      imageUrl = await ctx.storage.getUrl(project.imageId);
    }

    return { ...project, imageUrl };
  },
});

// Get projects with images (for contribution graph)
export const getProjectsWithImages = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();

    // Add image URLs
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

// Search projects
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

// Get featured projects (ordered first)
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

// Get project count
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

// Get all projects with contribution data (for contribution graph)
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
