"use client"

import { fetcher,  getRoomMetaUrl } from "@/lib/axios_requests/swr-fetcher";
import { createContext, useContext } from "react";
import useSWR from "swr";

interface Props {
	roomId: string;
	initialRoomMeta: RoomMeta;
	children: React.ReactNode;
    role: 'admin' | 'member'
}

interface RoomContextValue {
    roomMeta: RoomMeta | undefined;
    mutateMeta: () => Promise<any>;
    role: 'admin' | 'member'
  }


const RoomContext = createContext<RoomContextValue | null>(null);

//prettier-ignore
export function  RoomProvider({roomId, initialRoomMeta, role, children}: Props) {

    const {data: roomMeta, mutate: mutateMeta}  = useSWR(getRoomMetaUrl + roomId, fetcher<RoomMeta>,  {
        fallbackData: initialRoomMeta //* The data from the server action will be the first that will be placed in the SWR data.
    })  

    const value = { mutateMeta, roomMeta, role }

    return (
        <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
    )
}


export const useRoomContext = () => {
    const roomContext = useContext(RoomContext);
    if (!roomContext) {
        throw new Error('useRoomContext must be used within a <RoomProvider>');
    }
    return roomContext;
};
