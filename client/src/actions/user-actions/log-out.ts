"use server"

import { deleteSession } from "@/lib/session";

export const logOut = async () => {
    await deleteSession();   
};