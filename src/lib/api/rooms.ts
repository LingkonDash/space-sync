"use server";

import { protectedServerFetch, serverFetch } from "../core/server";
import type { Space } from "@/types/space";

// ── Get rooms (filtered/searched via query string, from Explore page) ────────
export const getRooms = async (queryString?: string): Promise<Space[]> => {
  return serverFetch<Space[]>(`/rooms${queryString ? `?${queryString}` : ""}`);
};

// ── Get single room by id (Details page) ──────────────────────────────────────
export const getRoomById = async (roomId: string): Promise<Space | null> => {
  return serverFetch<Space | null>(`/rooms/${roomId}`);
};

// ── Get featured rooms (Home page) ────────────────────────────────────────────
export const getFeaturedRooms = async (limit: number = 8): Promise<Space[]> => {
  return serverFetch<Space[]>(`/rooms/featured?limit=${limit}`);
};

// ── Get rooms related to a given room (same category/city, Details page) ─────
export const getRelatedRooms = async (roomId: string, limit: number = 4): Promise<Space[]> => {
  return serverFetch<Space[]>(`/rooms/${roomId}/related?limit=${limit}`);
};


export const getHostRooms = async (): Promise<Space[]> => {
  return protectedServerFetch<Space[]>(`/rooms/host/mine`);
};
export const getAdminRooms = async (): Promise<Space[]> => {
  return protectedServerFetch<Space[]>(`/rooms/host/admin`);
};