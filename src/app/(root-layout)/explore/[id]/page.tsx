'use server'

import { getRelatedRooms, getRoomById } from "@/lib/api/rooms";
import { reviewValidation, updateRoomValidation } from "@/utils/roomValidatons";
import RoomPageBody from "@/components/explore/details/RoomPageBody";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomsDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const room = await getRoomById(id);

  const canReview = await reviewValidation();
  const canUpdate = await updateRoomValidation();

  const reviews = room.reviews ?? [];
  const relatedSpaces = await getRelatedRooms(room._id)


  return (
    <RoomPageBody
      room={room}
      reviews={reviews}
      relatedSpaces={relatedSpaces}
      canReview={canReview}
      canUpdate={canUpdate}
    />
  );
}