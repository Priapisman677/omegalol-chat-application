"use client"

import { fetcher, getUserRoomsUrl } from "@/lib/axios_requests/swr-fetcher";
import { createContext, useContext } from "react";
import useSWR from "swr";

interface SideBarContextValue {
    data: ServerGetUserRooms | undefined
    mutate: () => Promise<any>
    isLoading: boolean
    error: any
    publicRooms: PublicRoomsActionResponse['rooms']
}

type Props = {
    children: React.ReactNode
    publicRooms: PublicRoomsActionResponse['rooms']
}
const SideBarContext = createContext<SideBarContextValue | null>(null);

//prettier-ignore
export default function SideBarContextProvider({children, publicRooms}: Props) {

    const {data, error, isLoading, mutate} = useSWR(getUserRoomsUrl, fetcher<ServerGetUserRooms>, {refreshInterval: 3000})

    const value = {data, mutate ,isLoading, error, publicRooms}

    return (
        <SideBarContext.Provider value={value}>{children}</SideBarContext.Provider>
    )
}

export const useSideBarContext = () => {
    const context = useContext(SideBarContext);
    if (!context) {
        throw new Error('useSideBarContext must be used within a <SideBarContextProvider>');
    }
    return context;
};
