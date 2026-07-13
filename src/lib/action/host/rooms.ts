'use server'

import { serverMutation } from "../../core/server"


export const addRoom = async (space) => {

  const res =  await serverMutation(`/rooms`, space)

  return res;
}


export const editRoom = async (updatedSpace, spaceId,) => {

  const res = await serverMutation(`/rooms/${spaceId}`, updatedSpace, 'PATCH');

  return res;
}


export const deleteRoom = async (spaceId) => {

  const res =  await serverMutation(`/rooms/${spaceId}`, {},'DELETE')

  return res;
}

