"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { ErrorContext } from "better-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [allowPublicUser, setAllowPublicUser] = useState(false);

  useEffect(() => {
    // Check if registration is allowed via API
    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch("/api/auth/registration-status");
        if (response.ok) {
          const data = await response.json();
          setAllowPublicUser(data.allowPublicUser || false);
        } else {
          console.error(
            "Failed to fetch registration status:",
            response.status,
          );
          setAllowPublicUser(false);
        }
      } catch (err) {
        console.error("Error checking registration status:", err);
        setAllowPublicUser(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await authClient.signIn.email(
      { email, password },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          router.push("/admin");
        },
        onError: (ctx: ErrorContext) => {
          setLoading(false);
          setError(ctx.error.message);
        },
      },
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name: name || "",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // After successful registration, automatically sign in
      await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            router.push("/admin");
          },
          onError: (ctx: ErrorContext) => {
            setLoading(false);
            setError(
              "Registration successful but login failed: " + ctx.error.message,
            );
          },
        },
      );
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
            {isRegistering ? "Create Account" : "Sign In"}
          </h1>
          <p className="font-mono text-sm text-zinc-500 mt-2">
            {isRegistering
              ? "Create a new admin account"
              : "Sign in to access the admin panel"}
          </p>

          {allowPublicUser && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-mono text-xs text-blue-700 dark:text-blue-300">
                {isRegistering
                  ? "Registration is enabled. Create your admin account below."
                  : "Registration is enabled. Need an account?"}
              </p>
              {!isRegistering && (
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="mt-2 font-mono text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                >
                  Create new account
                </button>
              )}
            </div>
          )}

          {isRegistering && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="font-mono text-xs text-amber-700 dark:text-amber-300">
                Already have an account?
              </p>
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="mt-2 font-mono text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 underline"
              >
                Sign in instead
              </button>
            </div>
          )}
        </div>

        <form
          onSubmit={isRegistering ? handleRegister : handleSignIn}
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                {error}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-mono text-sm text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading
              ? "Loading..."
              : isRegistering
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
