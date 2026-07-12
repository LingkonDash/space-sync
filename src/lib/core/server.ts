"use server";

import getJwtToken from "./session";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!baseUrl) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
}

// ── Auth header ────────────────────────────────────────────────────────────
export const authHeader = async (): Promise<Record<string, string>> => {
  const token = await getJwtToken();
  return token ? { authorization: `Bearer ${token}` } : {};
};

// ── Get public data ──────────────────────────────────────────────────────────
export const serverFetch = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`);

  if (!res.ok) {
    throw new Error(`serverFetch failed: ${res.status} ${res.statusText} — ${path}`);
  }

  const data: T = await res.json();
  return data;
};

// ── Get protected data ────────────────────────────────────────────────────────
export const protectedServerFetch = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
  });

  if (!res.ok) {
    throw new Error(`protectedServerFetch failed: ${res.status} ${res.statusText} — ${path}`);
  }

  const data: T = await res.json();
  return data;
};

// ── Server mutation (POST/PATCH/DELETE etc.) ──────────────────────────────────
export const serverMutation = async <TResponse, TBody = unknown>(
  path: string,
  data: TBody,
  method: "POST" | "PATCH" | "PUT" | "DELETE" = "POST"
): Promise<TResponse> => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`serverMutation failed: ${res.status} ${res.statusText} — ${path}`);
  }

  const responseData: TResponse = await res.json();
  return responseData;
};