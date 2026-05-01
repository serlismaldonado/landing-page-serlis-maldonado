"use client";

import { useState, useEffect } from "react";
import { EmailEditor } from "@react-email/editor";
import "@react-email/editor/themes/default.css";

interface TemplateData {
  id?: string;
  name: string;
  subject: string;
  content: string;
  type: "newsletter" | "confirmation" | "custom";
}

export default function EmailEditorPage() {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<"newsletter" | "confirmation" | "custom">("custom");
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/email-templates");
      const data = await res.json();
      if (data.templates) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleSave = async () => {
    if (!name || !subject || !content) {
      setMessage("Completa todos los campos");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, content, type }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Guardado!");
        setName("");
        setSubject("");
        setContent("");
        fetchTemplates();
      } else {
        setMessage(data.error || "Error al guardar");
      }
    } catch (error) {
      setMessage("Error de conexión");
    }
    setSaving(false);
  };

  const loadTemplate = (template: TemplateData) => {
    setName(template.name);
    setSubject(template.subject);
    setContent(template.content);
    setType(template.type);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Email Editor</h1>
        <a href="/" style={styles.backLink}>← Volver</a>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <h2 style={styles.sectionTitle}>Nuevo / Editar</h2>
            <input
              type="text"
              placeholder="Nombre del template"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Subject del email"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              style={styles.select}
            >
              <option value="newsletter">Newsletter</option>
              <option value="confirmation">Confirmación</option>
              <option value="custom">Custom</option>
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              style={styles.saveButton}
            >
              {saving ? "Guardando..." : "Guardar Template"}
            </button>
            {message && <p style={styles.message}>{message}</p>}
          </div>

          <div style={styles.sidebarSection}>
            <h2 style={styles.sectionTitle}>Templates</h2>
            <div style={styles.templateList}>
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => loadTemplate(t)}
                  style={styles.templateItem}
                >
                  {t.name}
                </button>
              ))}
              {templates.length === 0 && (
                <p style={styles.emptyText}>No hay templates aún</p>
              )}
            </div>
          </div>
        </aside>

        <main style={styles.editorContainer}>
          <EmailEditor
            appearance={{
              theme: "dark",
              panels: {
                tools: {
                  panel: ["Text", "Image", "Button", "Divider", "Spacer"],
                },
              },
            }}
            content={content}
            onChange={(c) => setContent(c)}
          />
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#ededed",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #27272a",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#22c55e",
    margin: 0,
  },
  backLink: {
    color: "#71717a",
    textDecoration: "none",
    fontFamily: "monospace",
    fontSize: "14px",
  },
  layout: {
    display: "flex",
    height: "calc(100vh - 65px)",
  },
  sidebar: {
    width: "300px",
    borderRight: "1px solid #27272a",
    overflowY: "auto",
    padding: "16px",
  },
  sidebarSection: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#18181b",
    border: "1px solid #27272a",
    borderRadius: "6px",
    color: "#ededed",
    fontSize: "14px",
    fontFamily: "monospace",
    marginBottom: "8px",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#18181b",
    border: "1px solid #27272a",
    borderRadius: "6px",
    color: "#ededed",
    fontSize: "14px",
    fontFamily: "monospace",
    marginBottom: "8px",
    boxSizing: "border-box",
  },
  saveButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#22c55e",
    border: "none",
    borderRadius: "6px",
    color: "#0a0a0a",
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "monospace",
    cursor: "pointer",
  },
  message: {
    fontSize: "12px",
    color: "#22c55e",
    marginTop: "8px",
    fontFamily: "monospace",
  },
  templateList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  templateItem: {
    padding: "10px 12px",
    backgroundColor: "#18181b",
    border: "1px solid #27272a",
    borderRadius: "6px",
    color: "#ededed",
    fontSize: "14px",
    fontFamily: "monospace",
    textAlign: "left",
    cursor: "pointer",
  },
  emptyText: {
    fontSize: "12px",
    color: "#52525b",
    fontFamily: "monospace",
  },
  editorContainer: {
    flex: 1,
    overflow: "hidden",
  },
};