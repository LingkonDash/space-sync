
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  _id?: string;
  spaceId: string;
  spaceTitle: string;
  spaceImages: string[];
  userId: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: Date;
}