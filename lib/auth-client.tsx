"use client";

import {
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  genericOAuthClient,
  anonymousClient,
} from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { PropsWithChildren } from "react";
import { api } from "@/convex/_generated/api";
import { AuthBoundary } from "@convex-dev/better-auth/react";
import { useRouter } from "next/navigation";
import { isAuthError } from "./utils";

export const authClient = createAuthClient({
  plugins: [
    anonymousClient(),
    magicLinkClient(),
    emailOTPClient(),
    twoFactorClient(),
    genericOAuthClient(),
    convexClient(),
  ],
});

export const ClientAuthBoundary = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  return (
    <AuthBoundary
      authClient={authClient}
      onUnauth={() => router.push("/login")}
      getAuthUserFn={api.auth.getCurrentUser}
      isAuthError={isAuthError}
    >
      {children}
    </AuthBoundary>
  );
};
