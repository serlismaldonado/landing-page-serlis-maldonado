"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SubscribeFormProps {
  showName?: boolean;
  redirectTo?: string;
}

export default function SubscribeForm({ showName = false, redirectTo }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Ingresá un email válido");
      return;
    }

    if (showName && !name.trim()) {
      setStatus("error");
      setMessage("Ingresá tu nombre");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...(showName && { name }),
          ...(redirectTo && { redirectTo }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Suscripto! Revisá tu email para confirmar.");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Error al suscribirse");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión");
    }
  };

  if (status === "success") {
    return (
      <div style={styles.successContainer}>
        <CheckCircle style={styles.successIcon} />
        <p style={styles.successText}>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {showName && (
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          disabled={status === "loading"}
        />
      )}
      <div style={styles.inputGroup}>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={status === "loading"}
          required
        />
        <button
          type="submit"
          style={styles.button}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <Loader2 style={styles.spinner} />
          ) : (
            <Send style={styles.sendIcon} />
          )}
        </button>
      </div>
      {status === "error" && (
        <div style={styles.errorContainer}>
          <AlertCircle style={styles.errorIcon} />
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "400px",
    width: "100%",
  },
  inputGroup: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#18181b",
    border: "1px solid #27272a",
    borderRadius: "8px",
    color: "#ededed",
    fontSize: "14px",
    fontFamily: "monospace",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "12px 16px",
    backgroundColor: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "#0a0a0a",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  },
  sendIcon: {
    width: "18px",
    height: "18px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#ef4444",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  errorIcon: {
    width: "14px",
    height: "14px",
  },
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "24px",
    textAlign: "center",
  },
  successIcon: {
    width: "48px",
    height: "48px",
    color: "#22c55e",
  },
  successText: {
    color: "#22c55e",
    fontSize: "14px",
    fontFamily: "monospace",
    margin: 0,
  },
};