import { serverMutation } from "@/lib/core/server";
import { SpaceStatus } from "@/types/space";




export const updateRoomStatus = async (
  spaceId: string,
  status: SpaceStatus,
) => {
  const res = await serverMutation(
    `/rooms/${spaceId}/status`,
    { status },
    "PATCH"
  );

  return res;
};