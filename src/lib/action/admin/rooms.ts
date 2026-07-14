import { serverMutation } from "@/lib/core/server";
import { SpaceStatus } from "@/types/space";

interface UpdateRoomStatusResponse {
    acknowledged: boolean;
    modifiedCount: number;
}


export const updateRoomStatus = (
  spaceId: string,
  status: SpaceStatus,
) => {
  return serverMutation<UpdateRoomStatusResponse>(
    `/rooms/${spaceId}/status`,
    { status },
    "PATCH"
  );
};