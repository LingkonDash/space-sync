'use server'

import { getAdminRooms, getHostRooms } from "@/lib/api/rooms";
import { getUserSession } from "@/lib/core/session"


export const manageValidator = async () => {
    const user = await getUserSession();
    let rooms = [];
    if (user?.userRole === 'host') rooms = await getHostRooms()
    if (user?.userRole === 'admin') rooms = await getAdminRooms()

    return { role: user?.userRole, canManage: true, roomData: rooms }
}
