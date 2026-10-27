"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return (
      <button
        className="p-3 rounded-lg bg-white/80 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 shadow-sm border border-zinc-200 dark:border-transparent"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-3 rounded-lg bg-white/80 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-green-600 dark:hover:text-green-500 transition-colors shadow-sm border border-zinc-200 dark:border-transparent"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
