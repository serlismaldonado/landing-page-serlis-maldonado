"use client";

import { X } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import ProjectImageUploader from "./ProjectImageUploader";
import ProjectCoverUploader from "./ProjectCoverUploader";

export interface ProjectFormData {
  title: string;
  description: string;
  url: string;
  cover?: Id<"_storage"> | null;
  images?: Id<"_storage">[];
  category: "proyecto" | "blog";
  tags: string;
  intensity: number;
  date: string;
  visibility?: "public" | "private";
}

export interface Project {
  _id: Id<"projects">;
  title: string;
  description?: string;
  url?: string;
  cover?: Id<"_storage">;
  images?: Id<"_storage">[];
  category: "proyecto" | "blog";
  tags: string[];
  intensity?: number;
  date?: string;
  visibility?: "public" | "private";
  order: number;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  editingProject: Project | null;
  formData: ProjectFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFormDataChange: (data: Partial<ProjectFormData>) => void;
  onResetForm: () => void;
  projectId?: Id<"projects"> | null;
}

export default function ProjectFormModal({
  isOpen,
  editingProject,
  formData,
  onClose,
  onSubmit,
  onFormDataChange,
  onResetForm,
  projectId,
}: ProjectFormModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    onResetForm();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      onFormDataChange({ [name]: parseFloat(value) || 0 });
    } else {
      onFormDataChange({ [name]: value });
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value as "public" | "private" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-lg font-bold text-zinc-900 dark:text-white">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="proyecto">Proyecto</option>
                  <option value="blog">Blog</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Intensity (0-4)
                </label>
                <input
                  type="number"
                  name="intensity"
                  min="0"
                  max="4"
                  value={formData.intensity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                Visibility
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={handleRadioChange}
                    className="text-blue-500"
                  />
                  <span className="font-mono text-sm">Public</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={handleRadioChange}
                    className="text-blue-500"
                  />
                  <span className="font-mono text-sm">Private</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                Project Cover
              </label>
              <ProjectCoverUploader
                projectId={editingProject?._id || projectId || null}
                onCoverChange={(coverId) =>
                  onFormDataChange({ cover: coverId })
                }
                currentCover={
                  formData.cover
                    ? { id: formData.cover as Id<"_storage"> }
                    : null
                }
              />
            </div>

            <div>
              <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                Project Images
              </label>
              <ProjectImageUploader
                projectId={editingProject?._id || projectId || null}
                onImagesChange={(imageIds) =>
                  onFormDataChange({ images: imageIds })
                }
                currentImages={formData.images?.map((id) => ({ id })) || []}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 font-mono text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
