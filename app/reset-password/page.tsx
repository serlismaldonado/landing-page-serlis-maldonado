"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"email" | "verify" | "reset" | "done">(
    "email",
  );
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestReset = useAction(
    api.passwordResetTokens.mutations.requestReset,
  );
  const verifyCode = useAction(api.passwordResetTokens.mutations.verifyCode);
  const verifyAndReset = useAction(
    api.passwordResetTokens.mutations.verifyAndReset,
  );

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Ingresá tu email");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await requestReset({ email });
      setStep("verify");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al enviar código";
      setError(message);
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Ingresá el código");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await verifyCode({ email, token });

      if (result.valid) {
        setStep("reset");
      } else {
        setError(result.error || "Código inválido");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error de conexión";
      setError(message);
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyAndReset({
        email,
        token,
        newPassword: password,
      });

      if (result.success) {
        setStep("done");
      } else {
        setError(result.error || "Error al restablecer contraseña");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error de conexión";
      setError(message);
    }
    setLoading(false);
  };

  if (step === "done") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-zinc-200 dark:border-zinc-800">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Contraseña actualizada
            </h1>
            <p className="font-mono text-sm text-zinc-500 mb-6">
              Ya podés iniciar sesión con tu nueva contraseña
            </p>
            <Link
              href="/login"
              className="inline-block py-2 px-4 bg-green-500 text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-green-400 transition-colors"
            >
              Ir al login
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
            Restablecer contraseña
          </h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                {error}
              </p>
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSendCode}>
              <div className="mb-4">
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
                disabled={loading}
                className="w-full py-2 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-xl tracking-widest"
                  placeholder="XXXXXX"
                  maxLength={6}
                  required
                />
              </div>

              <p className="text-xs text-zinc-500 mb-4 font-mono">
                Enviamos un código a{" "}
                <span className="text-green-500">{email}</span>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Verificando..." : "Verificar código"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset}>
              <div className="mb-4">
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repetí la contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-green-500 text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-green-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
