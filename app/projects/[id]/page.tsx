"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Globe,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as Id<"projects">;

  const project = useQuery(api.projects.queries.getPublicProject, {
    id: projectId,
  });

  // Calculate imageUrl directly from project data
  const imageUrl =
    project?.imageUrl ||
    (project?.imageId?.startsWith("http") ? project.imageId : null);

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-8" />
            <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-mono text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Project header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-mono text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                {project.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Visibility badge */}
              <span
                className={`px-3 py-1.5 text-sm font-mono rounded-full flex items-center gap-1.5 ${
                  project.visibility === "public"
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {project.visibility === "public" ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                {project.visibility}
              </span>

              {/* Category badge */}
              <span
                className={`px-3 py-1.5 text-sm font-mono rounded-full ${
                  project.category === "proyecto"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                }`}
              >
                {project.category}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-zinc-500">
            {project.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{project.date}</span>
              </div>
            )}

            {project.url && project.url !== "#" && (
              <a
                href={
                  project.url.startsWith("http")
                    ? project.url
                    : `https://${project.url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Visit project</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Project image */}
        {imageUrl && (
          <div className="mb-8">
            <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <div className="relative w-full h-96">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            </div>
          </div>
        )}

        {/* Project content */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-zinc-400" />
                <h3 className="font-mono text-sm font-medium text-zinc-500 uppercase">
                  Technologies & Skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 font-mono text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full description (if available) */}
          {project.description && (
            <div className="mb-6">
              <h3 className="font-mono text-lg font-bold text-zinc-900 dark:text-white mb-3">
                About this project
              </h3>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="font-mono text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {/* Project details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Intensity/Contribution level */}
            {project.intensity && project.intensity > 0 && (
              <div>
                <h4 className="font-mono text-sm font-medium text-zinc-500 uppercase mb-2">
                  Contribution Level
                </h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm ${
                        level <= project.intensity!
                          ? "bg-green-500 dark:bg-green-600"
                          : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    />
                  ))}
                  <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 ml-2">
                    Level {project.intensity}/4
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project ID (for debugging) */}
        <div className="mt-6 font-mono text-xs text-zinc-400 text-center">
          Project ID: {project._id}
        </div>
      </div>
    </div>
  );
}
