"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Eye,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import ContactLinks from "@/app/components/home/ContactLinks";
import ProjectGalleryCarousel from "@/app/components/projects/ProjectGalleryCarousel";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

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
      <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 px-4 sm:px-6 font-sans">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Cover image skeleton */}
          <div className="w-full h-48 md:h-64 lg:h-80 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-0" />

          <div className="relative -mt-12 py-12 px-4 sm:px-6 z-10">
            <div className="max-w-7xl mx-auto">
              {/* Header section */}
              <div className="bg-white dark:bg-zinc-950 rounded-lg px-4 sm:px-6 py-6 mb-4 sm:mb-6">
                <div className="font-mono">
                  {/* Title skeleton */}
                  <div className="h-8 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />

                  {/* Meta info skeleton (date, eye button) */}
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Gallery and Content */}
              <div className="grid grid-cols-1 gap-4 lg:gap-6 px-4 sm:px-6">
                {/* Gallery skeleton */}
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-6">
                  {/* Tags section */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      ))}
                    </div>
                  </div>

                  {/* About section */}
                  <div>
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6" />
                    </div>
                  </div>

                  {/* Intensity section */}
                  <div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-2 w-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact section */}
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-center space-y-4">
              <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto" />
              <div className="flex justify-center gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                ))}
              </div>
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
        <div className="relative w-full h-40 md:h-48 lg:h-56 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <Image
            src={coverUrl}
            alt={project.title}
            fill
            className="object-cover"
            style={{
              filter: 'grayscale(100%) brightness(0.7) contrast(1.6)'
            }}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-white dark:to-zinc-950" />
        </div>
      )}

      <div className={`relative -mt-20 py-12 px-4 sm:px-6 font-sans z-10 ${coverUrl ? "" : "py-12"}`}>
        <div className="max-w-7xl mx-auto">
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
                ? "bg-white dark:bg-zinc-950 rounded-lg px-4 sm:px-6 py-6"
                : "bg-zinc-50 dark:bg-zinc-950 rounded-b-lg px-4 sm:px-6 py-6 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className={coverUrl ? "px-4 sm:px-6" : "ml-4 sm:ml-6 mb-8 mr-4 sm:mr-6"}>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 px-4 sm:px-6">
              {/* Title */}
              <div className="lg:col-span-3">
                <h2 className="font-mono text-2xl md:text-3xl font-bold text-zinc-900 dark:text-gray-300 mb-3">
                  {project.title}
                </h2>
              </div>

              {/* Gallery */}
              <div className="">
                {project.imageUrls && project.imageUrls.length > 0 && (
                  <ProjectGalleryCarousel
                    images={
                      project.imageUrls?.filter((url): url is string => !!url) ||
                      []
                    }
                    projectTitle={project.title}
                  />
                )}
              </div>

              {/* Content */}
              <div className="lg:col-span-2">
                <div className="">
                  <div className="space-y-8">
                {project.description && (
                  <div>
                    <div className="prose prose-zinc dark:prose-invert max-w-none columns-1 md:columns-2 lg:columns-3 gap-8">
                      <ReactMarkdown
                        remarkPlugins={[remarkBreaks]}
                        components={{
                          p: ({node, ...props}) => (
                            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 leading-loose mb-4" {...props} />
                          ),
                          br: () => <br />,
                          strong: ({node, ...props}) => (
                            <strong className="font-bold text-zinc-800 dark:text-zinc-300" {...props} />
                          ),
                          em: ({node, ...props}) => (
                            <em className="italic" {...props} />
                          ),
                          code: ({node, ...props}) => (
                            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs" {...props} />
                          ),
                          ul: ({node, ...props}) => (
                            <ul className="list-disc list-inside font-mono text-xs text-zinc-600 dark:text-zinc-400" {...props} />
                          ),
                          ol: ({node, ...props}) => (
                            <ol className="list-decimal list-inside font-mono text-xs text-zinc-600 dark:text-zinc-400" {...props} />
                          ),
                          li: ({node, ...props}) => (
                            <li className="mb-1" {...props} />
                          ),
                        }}
                      >
                        {project.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {project.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2.5 py-1.5 font-mono text-xs bg-black text-white rounded border border-zinc-700 hover:border-zinc-500 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.intensity && project.intensity > 0 && (
                  <div className="flex items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
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
                        Level {project.intensity}/5
                      </span>
                    </div>

                    {project.date && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
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
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-black hover:bg-green-600 transition-colors"
                        title="Visit project"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
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
