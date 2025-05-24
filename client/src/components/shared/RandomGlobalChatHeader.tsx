"use client"

import { getOnlineGlobalSocketsCount } from "@/actions/redis-actions/get-online-users-number"
import { useEffect, useState } from "react"
import UsersTyping from "./UsersTyping"
import { usePassiveSocket } from "@/hooks/usePassiveSocket"


export function  RandomGlobalChatHeader({usersTyping} : {usersTyping: string[]}) {

    
    
    const [usersOnline, setUsersOnline] = useState<number>(0)
    
    useEffect(() => {
        const getGlobalUsersCount = async () => {
            const onlineUsersNumber = await getOnlineGlobalSocketsCount()
            return onlineUsersNumber
        }

        getGlobalUsersCount().then((count) => {
            setUsersOnline(count)
        })
    }, [])


	const atLeastOneOnline = usersOnline > 0


    usePassiveSocket('random', undefined, setUsersOnline) //* This is just being called for the users online.
    return (
        <div className="w-full h-9 bg-[#1f1f1f] flex border-t border-[#232323] px-5 items-center">
            <div className="flex-1 min-w-0">
                <UsersTyping usersTyping={usersTyping} />
            </div>
            <div className="text-[#6d6b6b] text-sm flex items-center pl-2 ml-4">
                <div
                className={`w-2 h-2 rounded-full mr-2 ${
                    atLeastOneOnline ? 'bg-green-500' : 'bg-gray-500'
                }`}
                />
                {usersOnline} users online
            </div>
        </div>
    )
}