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

  const imageUrl = project?.imageUrls?.[0] || null;

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 px-4 font-sans">
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="font-mono text-sm sm:text-base text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 rounded-t-lg px-4 py-3 border border-zinc-200 dark:border-zinc-800 border-b-0 mb-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => router.back()}
                className="relative w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer group"
                title="Close (go back)"
              ></button>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-zinc-500 dark:text-zinc-500 text-sm truncate block">
                serlis@heskala: ~/projects/{projectId}
              </span>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="font-mono text-sm sm:text-base text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 rounded-b-lg px-6 py-6 border border-zinc-200 dark:border-zinc-800">
          {/* Project header */}
          <div className="ml-4 mb-8">
            <div className="mb-4">
              <h2 className="font-mono text-xl font-bold text-zinc-900 dark:text-gray-300 mb-3">
                {project.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Visibility badge */}
              <span
                className={`px-2.5 py-1 text-xs font-mono rounded-full flex items-center gap-1.5 ${
                  project.visibility === "public"
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {project.visibility === "public" ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
                {project.visibility}
              </span>

              {/* Category badge */}
              <span
                className={`px-2.5 py-1 text-xs font-mono rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300`}
              >
                {project.category}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-zinc-500 mb-6">
              {project.date && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
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
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-green-600 dark:hover:text-green-500 transition-colors text-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit project</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Image command */}
          {imageUrl && (
            <div className="mb-6">
              <span className="text-green-600 dark:text-green-500">$</span>
              <span className="text-zinc-600 dark:text-zinc-400 ml-2">
                {" "}
                open{" "}
              </span>
              <span className="text-green-600 dark:text-green-500">
                preview.png
              </span>
            </div>
          )}

          {/* Project image */}
          {imageUrl && (
            <div className="ml-4 mb-8">
              <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div className="relative w-full h-64 md:h-80">
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

          {/* Separator */}
          <div className="my-6">
            <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 w-full"></div>
          </div>

          {/* Project content */}
          <div className="ml-4 space-y-8">
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="font-mono text-base font-bold text-zinc-900 dark:text-gray-300 mb-3">
                  <span className="text-green-600 dark:text-green-500">→</span>{" "}
                  technologies/skills
                </h4>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {project.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 font-mono text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full description (if available) */}
            {project.description && (
              <div>
                <h4 className="font-mono text-base font-bold text-zinc-900 dark:text-gray-300 mb-3">
                  <span className="text-green-600 dark:text-green-500">→</span>{" "}
                  About this project
                </h4>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
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
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-xs ${
                          level <= project.intensity!
                            ? "bg-green-500 dark:bg-green-600"
                            : "bg-zinc-200 dark:bg-zinc-800"
                        }`}
                      />
                    ))}
                    <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 ml-2">
                      Level {project.intensity}/4
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terminal Prompt */}
          <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center min-w-0">
              <span className="text-green-600 dark:text-green-500 text-sm truncate block">
                serlis@heskala:~/projects/{projectId}$
              </span>
              <span className="inline-block w-2 h-1 pb-0 mb-0 ml-1 bg-green-600 dark:bg-green-500 animate-pulse flex-shrink-0"></span>
            </div>
          </div>
        </div>

        {/* Project ID (for debugging) */}
        <div className="mt-6 font-mono text-xs text-zinc-400 text-center">
          <div className="truncate max-w-[300px] mx-auto">
            Project ID: {project._id}
          </div>
        </div>
      </div>
    </div>
  );
}
