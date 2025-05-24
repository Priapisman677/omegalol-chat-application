"use client"

import { useChatSocket } from "@/hooks/useChatSocket";
import { usePassiveSocket } from "@/hooks/usePassiveSocket";

export default function  Home() {


    useChatSocket('home');
    usePassiveSocket('home') //* This is just being called to set listeners to receive invitations.
    
    return (
        <div className="flex items-center justify-center h-full">Welcome back!</div>
    )
}