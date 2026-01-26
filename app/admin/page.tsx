"use client";

import { useState, useEffect } from "react";
import { useConvex, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff, Edit2, LogOut, ExternalLink } from "lucide-react";

interface Project {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  url?: string;
  category: "proyecto" | "blog";
  tags: string[];
  intensity?: number;
  date?: string;
  visibility: "public" | "private";
  order: number;
}

export default function AdminPage() {
  const convex = useConvex();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    category: "proyecto" as "proyecto" | "blog",
    tags: "",
    intensity: 0,
    date: "",
    visibility: "public" as "public" | "private",
  });

  const projects = useQuery(api.projects.queries.getAllProjectsAdmin);
  const createProject = useMutation(api.projects.mutations.createProject);
  const updateProject = useMutation(api.projects.mutations.updateProject);
  const deleteProject = useMutation(api.projects.mutations.deleteProject);
  const toggleVisibility = useMutation(api.projects.mutations.toggleVisibility);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      if (!session) {
        router.push("/(auth)");
      } else {
        setUser(session.user);
      }
    } catch (err) {
      router.push("/(auth)");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

      if (editingProject) {
        await updateProject({
          id: editingProject._id,
          ...formData,
          tags: tagsArray,
        });
      } else {
        await createProject({
          ...formData,
          tags: tagsArray,
        });
      }

      setShowForm(false);
      setEditingProject(null);
      resetForm();
    } catch (err: any) {
      alert(err.message || "Error saving project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      url: project.url || "",
      category: project.category,
      tags: project.tags.join(", "),
      intensity: project.intensity || 0,
      date: project.date || "",
      visibility: project.visibility,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject({ id });
    } catch (err: any) {
      alert(err.message || "Error deleting project");
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      await toggleVisibility({ id });
    } catch (err: any) {
      alert(err.message || "Error toggling visibility");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      category: "proyecto",
      tags: "",
      intensity: 0,
      date: "",
      visibility: "public",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="font-mono text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-mono text-xl font-bold text-zinc-900 dark:text-white">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-zinc-500">
              {user.name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingProject(null);
              resetForm();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
          <span className="font-mono text-sm text-zinc-500">
            {projects?.length || 0} projects
          </span>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 mb-8"
          >
            <h2 className="font-mono text-lg font-bold text-zinc-900 dark:text-white mb-4">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
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
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as "proyecto" | "blog",
                    })
                  }
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
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
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Intensity (0-4)
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={formData.intensity}
                  onChange={(e) =>
                    setFormData({ ...formData, intensity: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === "public"}
                  onChange={() =>
                    setFormData({ ...formData, visibility: "public" })
                  }
                  className="w-4 h-4"
                />
                <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  Public
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === "private"}
                  onChange={() =>
                    setFormData({ ...formData, visibility: "private" })
                  }
                  className="w-4 h-4"
                />
                <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  Private
                </span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
                className="px-6 py-2 font-mono text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Projects List */}
        {projects === undefined ? (
          <div className="text-center py-12">
            <div className="font-mono text-zinc-500">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="font-mono text-zinc-500 mb-4">
              No projects yet
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 font-mono text-sm text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-xs font-medium text-zinc-500 uppercase">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs font-medium text-zinc-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs font-medium text-zinc-500 uppercase">
                    Visibility
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs font-medium text-zinc-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-xs font-medium text-zinc-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {projects.map((project: Project) => (
                  <tr key={project._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm font-medium text-zinc-900 dark:text-white">
                        {project.title}
                      </div>
                      <div className="font-mono text-xs text-zinc-500 truncate max-w-xs">
                        {project.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-mono rounded-full ${
                          project.category === "proyecto"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {project.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-mono rounded-full ${
                          project.visibility === "public"
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {project.visibility}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-zinc-500">
                        {project.date || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisibility(project._id)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                          title="Toggle visibility"
                        >
                          {project.visibility === "public" ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-1.5 text-zinc-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {project.url && project.url !== "#" && (
                          <a
                            href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            title="Open"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
