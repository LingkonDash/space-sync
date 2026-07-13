import { InsertOneResult } from "mongodb";
import { protectedServerFetch, serverMutation } from "../core/server";
import { Booking } from "@/types/bookings";



// ── Create bookings ───────────────────────────────────────────────────────────────
export const postBookings = async (
  booking: Booking
): Promise<InsertOneResult> => {
  return serverMutation<InsertOneResult, Booking>(
    "/bookings",
    booking
  );
};

export const getUserBookings = async () => {
  const res = await protectedServerFetch(`/bookings/me`)
  return res
}