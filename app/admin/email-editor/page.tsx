"use client";

import { useState } from "react";
import Link from "next/link";
import { EmailEditor } from "@react-email/editor";
import "@react-email/editor/themes/default.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type TemplateType = "newsletter" | "confirmation" | "custom";

export default function EmailEditorPage() {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<TemplateType>("custom");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const templates = useQuery(api.emailTemplates.queries.list, {}) ?? [];
  const createTemplate = useMutation(api.emailTemplates.mutations.create);

  const handleSave = async () => {
    if (!name || !subject || !content) {
      setMessage("Completa todos los campos");
      return;
    }

    setSaving(true);
    try {
      await createTemplate({ name, subject, content, type });
      setMessage("Guardado!");
      setName("");
      setSubject("");
      setContent("");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al guardar";
      setMessage(msg);
    }
    setSaving(false);
  };

  const loadTemplate = (template: {
    name: string;
    subject: string;
    content: string;
    type: TemplateType;
  }) => {
    setName(template.name);
    setSubject(template.subject);
    setContent(template.content);
    setType(template.type);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <h1 className="font-mono text-xl font-bold text-green-500">
          Email Editor
        </h1>
        <Link
          href="/"
          className="font-mono text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Volver
        </Link>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-[300px] border-r border-zinc-800 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
              Nuevo / Editar
            </h2>
            <input
              type="text"
              placeholder="Nombre del template"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-100 font-mono text-sm mb-2 outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Subject del email"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-100 font-mono text-sm mb-2 outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TemplateType)}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-100 font-mono text-sm mb-2 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="newsletter">Newsletter</option>
              <option value="confirmation">Confirmacion</option>
              <option value="custom">Custom</option>
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-green-500 border-0 rounded-md text-zinc-950 font-mono text-sm font-bold cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Template"}
            </button>
            {message && (
              <p className="font-mono text-xs text-green-500 mt-2">{message}</p>
            )}
          </div>

          <div>
            <h2 className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
              Templates
            </h2>
            <div className="flex flex-col gap-2">
              {templates.map((t) => (
                <button
                  key={t._id}
                  onClick={() => loadTemplate(t)}
                  className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-100 font-mono text-sm text-left cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  {t.name}
                </button>
              ))}
              {templates.length === 0 && (
                <p className="font-mono text-xs text-zinc-600">
                  No hay templates aun
                </p>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden min-h-0">
          <EmailEditor
            theme="minimal"
            className="w-full h-full"
            content={content}
            onUpdate={(ref) => {
              ref.getEmailHTML().then(setContent);
            }}
          />
        </main>
      </div>
    </div>
  );
}
