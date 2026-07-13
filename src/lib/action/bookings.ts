import { InsertOneResult } from "mongodb";
import { serverMutation } from "../core/server";
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