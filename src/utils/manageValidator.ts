'use server'

import { getAdminRooms, getHostRooms } from "@/lib/api/rooms";
import { getUserSession } from "@/lib/core/session"


export const manageValidator = async () => {
    const user = await getUserSession();
    if (user?.userRole === 'host') {

        const rooms = await getHostRooms()

        return { role: user?.userRole, canManage: true, roomData: rooms }
    }
    if (user?.userRole === 'admin') {
        const rooms = await getAdminRooms()
        return { role: user?.userRole, canManage: true, roomData: rooms }

    }
    return { role: 'user', canManage:false, roomData:[] }

}
