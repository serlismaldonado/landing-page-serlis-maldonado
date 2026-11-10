import { isAdminRequest } from "@/lib/require-admin";
import { ClientAuthBoundary } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AdminLayout({ children }: PropsWithChildren) {
  if (!(await isAdminRequest())) {
    redirect("/login");
  }
  return <ClientAuthBoundary>{children}</ClientAuthBoundary>;
}
