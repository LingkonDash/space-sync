'use server'

import { getUserSession } from "@/lib/core/session"


export const reviewValidation = async () => {
    const user = await getUserSession();
    
    // return true;
     return false;
}

export const updateRoomValidation = async () => {
    const user = await getUserSession();
    const canUpdate = user?.userRole === 'host' || user?.userRole === 'admin';
    
    return {canUpdate, redirectLink: '/dashboard/items/manage'}
}