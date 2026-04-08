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
import ContactLinks from "@/app/components/home/ContactLinks";
import ProjectGalleryCarousel from "@/app/components/projects/ProjectGalleryCarousel";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as Id<"projects">;

  const project = useQuery(api.projects.queries.getPublicProject, {
    id: projectId,
  });

  const coverUrl = project?.coverUrl || null;

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
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors backdrop-blur-sm shadow-lg"
        title="Go back to home"
      >
        <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-white" />
      </button>

      {coverUrl && (
        <div className="relative w-full h-64 md:h-96 lg:h-[32rem] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <Image
            src={coverUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-white dark:to-zinc-950" />
        </div>
      )}

      <div className={`py-12 px-4 font-sans ${coverUrl ? "" : "py-12"}`}>
        <div className="max-w-4xl mx-auto">
          {!coverUrl && (
            <div className="font-mono text-sm sm:text-base text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 rounded-t-lg px-4 py-3 border border-zinc-200 dark:border-zinc-800 border-b-0 mb-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => router.back()}
                    className="relative w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                    title="Close (go back)"
                  />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-zinc-500 dark:text-zinc-500 text-sm truncate block">
                    serlis@heskala: ~/projects/{projectId}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div
            className={`font-mono text-sm sm:text-base text-zinc-700 dark:text-zinc-300 ${
              coverUrl
                ? "bg-transparent"
                : "bg-zinc-50 dark:bg-zinc-950 rounded-b-lg px-6 py-6 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className={coverUrl ? "max-w-4xl mx-auto px-4" : "ml-4 mb-8"}>
              <div className="mb-4">
                <h2 className="font-mono text-2xl md:text-3xl font-bold text-zinc-900 dark:text-gray-300 mb-3">
                  {project.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
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

                <span
                  className={`px-2.5 py-1 text-xs font-mono rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300`}
                >
                  {project.category}
                </span>
              </div>

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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500 text-black hover:bg-green-600 transition-colors text-xs font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit project</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {project.imageUrls && project.imageUrls.length > 0 && (
              <div className={coverUrl ? "px-4" : ""}>
                <ProjectGalleryCarousel
                  images={
                    project.imageUrls?.filter((url): url is string => !!url) ||
                    []
                  }
                  projectTitle={project.title}
                />
              </div>
            )}

            {!coverUrl && (
              <div className="my-6">
                <div className="border-t border-dashed border-zinc-300 dark:border-zinc-700 w-full" />
              </div>
            )}

            <div className={coverUrl ? "px-4" : "ml-4"}>
              <div className="space-y-8">
                {project.tags && project.tags.length > 0 && (
                  <div>
                    <h4 className="font-mono text-base font-bold text-zinc-900 dark:text-gray-300 mb-3">
                      <span className="text-green-600 dark:text-green-500">
                        →
                      </span>{" "}
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

                {project.description && (
                  <div>
                    <h4 className="font-mono text-base font-bold text-zinc-900 dark:text-gray-300 mb-3">
                      <span className="text-green-600 dark:text-green-500">
                        →
                      </span>{" "}
                      About this project
                    </h4>
                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                      <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                )}

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

            {!coverUrl && (
              <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center min-w-0 ml-4">
                  <span className="text-green-600 dark:text-green-500 text-sm truncate block">
                    serlis@heskala:~/projects/{projectId}$
                  </span>
                  <span className="inline-block w-2 h-1 pb-0 mb-0 ml-1 bg-green-600 dark:bg-green-500 animate-pulse flex-shrink-0" />
                </div>
              </div>
            )}
          </div>

          <div
            className={`mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 ${coverUrl ? "pb-8" : ""}`}
          >
            <div className="text-center">
              <h3 className="font-mono text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Conéctate conmigo
              </h3>
              <ContactLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
