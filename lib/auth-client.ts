"use client";

import { useAuth } from "@convex-dev/auth/react";
import { ReactNode } from "react";

export function ClientAuthBoundary({ children }: { children: ReactNode }) {
  const { isAuthenticated: isAuth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
