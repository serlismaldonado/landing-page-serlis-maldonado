"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Upload, Trash2, Loader2, AlertCircle } from "lucide-react";

interface ProjectImageUploaderProps {
  projectId: Id<"projects"> | null;
  onImagesChange: (imageIds: Id<"_storage">[]) => void;
  currentImages?: { id: Id<"_storage">; preview?: string }[];
}

export default function ProjectImageUploader({
  projectId,
  onImagesChange,
  currentImages = [],
}: ProjectImageUploaderProps) {
  const [images, setImages] = useState(currentImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const uploadImage = useMutation(api.projects.mutations.uploadProjectImage);
  const deleteImage = useMutation(api.projects.mutations.deleteProjectImage);
  const generateUploadUrl = useMutation(
    api.projects.mutations.generateUploadUrl,
  );

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || !projectId) {
        setError("Please create project first or select files");
        return;
      }

      if (images.length + files.length > 10) {
        setError("Maximum 10 images per project");
        return;
      }

      setUploading(true);
      setError(null);

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (!file.type.startsWith("image/")) {
            setError(`${file.name} is not an image`);
            continue;
          }

          if (file.size > 5 * 1024 * 1024) {
            setError(`${file.name} is larger than 5MB`);
            continue;
          }

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

          await uploadImage({
            projectId,
            file: storageId,
          });

          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (result && typeof result === "string") {
              setPreviews((prev) => ({
                ...prev,
                [storageId]: result,
              }));
            }
          };
          reader.readAsDataURL(file);

          setImages((prev) => [...prev, { id: storageId }]);
          onImagesChange([...images, { id: storageId }].map((img) => img.id));
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error uploading images";
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [projectId, images, uploadImage, generateUploadUrl, onImagesChange],
  );

  const handleDeleteImage = useCallback(
    async (imageId: Id<"_storage">) => {
      if (!projectId) return;

      setUploading(true);
      setError(null);

      try {
        await deleteImage({
          projectId,
          imageId,
        });

        const updatedImages = images.filter((img) => img.id !== imageId);
        setImages(updatedImages);
        setPreviews((prev) => {
          const newPreviews = { ...prev };
          delete newPreviews[imageId as string];
          return newPreviews;
        });

        onImagesChange(updatedImages.map((img) => img.id));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error deleting image";
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [projectId, images, deleteImage, onImagesChange],
  );

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
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600">
        <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono">
          <AlertCircle className="w-4 h-4" />
          Save project first to add images
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />

        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-2" />
              <span className="font-mono text-sm text-zinc-500">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                Click or drag images here
              </span>
              <span className="font-mono text-xs text-zinc-500 mt-1">
                Max 5MB, up to 10 images
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="font-mono text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              {previews[image.id as string] ? (
                <img
                  src={previews[image.id as string]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-zinc-400">
                    <Upload className="w-6 h-6 mx-auto opacity-50" />
                  </div>
                </div>
              )}

              <button
                onClick={() => handleDeleteImage(image.id)}
                disabled={uploading}
                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {image.id.substring(0, 8)}...
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs font-mono text-zinc-500">
        {images.length} / 10 images uploaded
      </div>
    </div>
  );
}
