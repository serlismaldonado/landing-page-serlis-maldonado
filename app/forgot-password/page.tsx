"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const requestReset = useAction(
    api.passwordResetTokens.mutations.requestReset,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await requestReset({ email });
      setSent(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al enviar código";
      setError(message);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-zinc-200 dark:border-zinc-800">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Revisá tu email
            </h1>
            <p className="font-mono text-sm text-zinc-500 mb-6">
              Si el email existe en nuestro sistema, recibirás un código para
              restablecer tu contraseña.
            </p>
            <Link
              href="/login"
              className="font-mono text-sm text-green-500 hover:text-green-400"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link
            href="/login"
            className="font-mono text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← Volver al login
          </Link>
          <h1 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white mt-4">
            Olvidaste tu contraseña?
          </h1>
          <p className="font-mono text-sm text-zinc-500 mt-2">
            Ingresá tu email y te enviaremos un código de verificación
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                {error}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            Enviar código
          </button>
        </form>
      </div>
    </div>
  );
}
