import { serverMutation } from "@/lib/core/server";
import { SpaceStatus } from "@/types/space";

interface UpdateRoomStatusResponse {
    acknowledged: boolean;
    modifiedCount: number;
}


export const updateRoomStatus = async (
  spaceId: string,
  status: SpaceStatus,
): Promise<UpdateRoomStatusResponse>  => {
  const res = await serverMutation(
    `/rooms/${spaceId}/status`,
    { status },
    "PATCH"
  );

  return res;
};