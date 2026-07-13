"use server";

import { serverMutation } from "../../core/server";
import type { Space } from "@/types/space";
import type {
  InsertOneResult,
  UpdateResult,
  DeleteResult,
} from "mongodb";

// ── Create room ───────────────────────────────────────────────────────────────
export const addRoom = async (
  space: Space
): Promise<InsertOneResult> => {
  return serverMutation<InsertOneResult, Space>(
    "/rooms",
    space
  );
};

// ── Update room ───────────────────────────────────────────────────────────────
export const editRoom = async (
  updatedSpace: Partial<Space>,
  spaceId: string
): Promise<UpdateResult> => {
  return serverMutation<UpdateResult, Partial<Space>>(
    `/rooms/${spaceId}`,
    updatedSpace,
    "PATCH"
  );
};

// ── Delete room ───────────────────────────────────────────────────────────────
export const deleteRoom = async (
  spaceId: string
): Promise<DeleteResult> => {
  return serverMutation<DeleteResult, Record<string, never>>(
    `/rooms/${spaceId}`,
    {},
    "DELETE"
  );
};