'use server'

import { getRooms } from "@/lib/api/rooms";
import { getUserSession } from "@/lib/core/session"


export const manageValidator = async () => {
    const user = await getUserSession();

    const rooms = await getRooms()

    return { role: 'admin', canManage: true, roomData: rooms, currentPage: 1, totalPages: 2, totalCount: 20 }
}
