import { InsertOneResult } from "mongodb";
import { protectedServerFetch, serverMutation } from "../core/server";
import { Booking, BookingStatus } from "@/types/bookings";

interface UpdateRoomStatusResponse {
    acknowledged: boolean;
    modifiedCount: number;
}

// ── Create bookings ───────────────────────────────────────────────────────────────
export const postBookings = async (
  booking: Booking
): Promise<InsertOneResult> => {
  return serverMutation<InsertOneResult, Booking>(
    "/bookings",
    booking
  );
};

export const getUserBookings = async (): Promise<Booking[]> => {
  return protectedServerFetch<Booking[]>(`/bookings/me`);
};

export const getHostBookings = async (): Promise<Booking[]> => {
  return protectedServerFetch<Booking[]>(`/bookings/host`);
};

export const getAdminBookings = async (): Promise<Booking[]> => {
  return protectedServerFetch<Booking[]>(`/bookings/admin`);
}

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
): Promise<UpdateRoomStatusResponse>  => {
  const res = await serverMutation<UpdateRoomStatusResponse>(
    `/bookings/${bookingId}/status`,
    { status },
    "PATCH"
  );

  return res;
};