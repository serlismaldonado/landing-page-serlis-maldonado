"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      setError(error.message ?? "Error al enviar el código");
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await authClient.signIn.emailOtp(
      { email, otp },
      { onSuccess: () => router.push("/admin") },
    );

    if (error) {
      setError(error.message ?? "Código incorrecto o expirado");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="mb-8">
          <p className="font-mono text-xs text-zinc-600 mb-4">
            serlismaldonado.com
          </p>
          <h1 className="font-mono text-xl font-bold text-white">
            {step === "email" ? "Iniciar sesión" : "Revisá tu email"}
          </h1>
          <p className="font-mono text-sm text-zinc-500 mt-1">
            {step === "email"
              ? "Te enviamos un código de acceso."
              : `Código enviado a ${email}`}
          </p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-sm text-red-400 font-mono">{error}</p>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-4">
                <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wide mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 font-mono text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="tu@email.com"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label className="block font-mono text-xs text-zinc-500 uppercase tracking-wide mb-2">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-2.5 font-mono text-2xl bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors text-center tracking-[0.5em]"
                  placeholder="——————"
                  maxLength={6}
                  required
                  autoFocus
                  inputMode="numeric"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-2.5 px-4 bg-white text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Verificando..." : "Ingresar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
                className="w-full mt-3 py-2 font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Cambiar email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
