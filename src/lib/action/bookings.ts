import { InsertOneResult } from "mongodb";
import { protectedServerFetch, serverMutation } from "../core/server";
import { Booking, BookingStatus } from "@/types/bookings";



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

export const getHostBookings = async () => {
  const res = await protectedServerFetch(`/bookings/host`)
  return res
}

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const res = await serverMutation(
    `/bookings/${bookingId}/status`,
    { status },
    "PATCH"
  );

  return res;
};