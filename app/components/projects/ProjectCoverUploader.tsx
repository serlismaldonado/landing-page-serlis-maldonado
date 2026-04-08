"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Upload, Trash2, Loader2, AlertCircle, X } from "lucide-react";

interface ProjectCoverUploaderProps {
  projectId: Id<"projects"> | null;
  onCoverChange: (coverId: Id<"_storage"> | null) => void;
  currentCover?: { id: Id<"_storage">; preview?: string } | null;
}

export default function ProjectCoverUploader({
  projectId,
  onCoverChange,
  currentCover = null,
}: ProjectCoverUploaderProps) {
  const [cover, setCover] = useState(currentCover);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(
    currentCover?.preview || null,
  );

  const uploadCover = useMutation(api.projects.mutations.uploadCover || (() => Promise.reject("Not available")) as any);
  const deleteCover = useMutation(api.projects.mutations.deleteCover || (() => Promise.reject("Not available")) as any);
  const generateUploadUrl = useMutation(
    api.projects.mutations.generateUploadUrl,
  );

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || !projectId) {
        setError("Please create project first or select file");
        return;
      }

      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be smaller than 10MB");
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const uploadUrl = await generateUploadUrl();

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const { storageId } = await response.json();

        await uploadCover({
          projectId,
          file: storageId,
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result && typeof result === "string") {
            setPreview(result);
          }
        };
        reader.readAsDataURL(file);

        setCover({ id: storageId });
        onCoverChange(storageId);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error uploading cover";
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [projectId, uploadCover, generateUploadUrl, onCoverChange],
  );

  const handleDeleteCover = useCallback(async () => {
    if (!projectId || !cover) return;

    setUploading(true);
    setError(null);

    try {
      await deleteCover({
        projectId,
        coverId: cover.id,
      });

      setCover(null);
      setPreview(null);
      onCoverChange(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error deleting cover";
      setError(message);
    } finally {
      setUploading(false);
    }
  }, [projectId, cover, deleteCover, onCoverChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  if (!projectId) {
    return (
      <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600">
        <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono">
          <AlertCircle className="w-4 h-4" />
          Save project first to add cover
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!cover ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative p-8 bg-zinc-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors aspect-video flex items-center justify-center"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={uploading}
            className="hidden"
            id="cover-upload"
          />

          <label
            htmlFor="cover-upload"
            className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
          >
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-zinc-400 animate-spin mb-3" />
                <span className="font-mono text-sm text-zinc-500">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-zinc-400 mb-3" />
                <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 text-center">
                  Click or drag cover image here
                </span>
                <span className="font-mono text-xs text-zinc-500 mt-2">
                  Max 10MB • Aspect ratio 16:9 recommended
                </span>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group">
          {preview ? (
            <img
              src={preview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-zinc-400">
                <Upload className="w-8 h-8 mx-auto opacity-50" />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />

          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <label htmlFor="cover-upload-change" className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                disabled={uploading}
                className="hidden"
                id="cover-upload-change"
              />
              <button
                onClick={() => document.getElementById("cover-upload-change")?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-mono rounded-lg hover:bg-blue-600 transition-colors"
                title="Change cover"
              >
                Change
              </button>
            </label>

            <button
              onClick={handleDeleteCover}
              disabled={uploading}
              className="px-4 py-2 bg-red-500 text-white text-sm font-mono rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              title="Delete cover"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>

          <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity truncate">
            {cover.id.substring(0, 12)}...
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="font-mono text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
