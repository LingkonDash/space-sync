"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { SessionUser } from "@/types/auth";

export type UserRole = "user" | "host" | "admin";

// ── Current logged-in user (or null) ─────────────────────────────────────────
export const getUserSession = async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
};

export type UserSessionType = Awaited<ReturnType<typeof getUserSession>>;

// ── JWT token for authenticated API calls ────────────────────────────────────
const getJwtToken = async (): Promise<string | null> => {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  return token ?? null;
};

export default getJwtToken;

// ── Page-level role guard ─────────────────────────────────────────────────────
// Usage: await requireRole("admin")            → single role
//        await requireRole(["host", "admin"])  → any of these roles
export const requireRole = async (
  allowedRoles: UserRole | UserRole[]
): Promise<NonNullable<UserSessionType>> => {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const userRole = user.userRole as UserRole;

  if (!roles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return user;
};