"use client"

import { FaRegQuestionCircle } from "react-icons/fa"

export function  Info({text}: {text: string}) {
    return (
        <div className="relative group">
            <FaRegQuestionCircle className="w-4 h-4 text-orange-500 cursor-pointer" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 mt-1 w-max pointer-events-none px-2 py-1 text-xs text-white bg-[#101011] border border-[#212121] rounded opacity-0 group-hover:opacity-100  z-10 whitespace-nowrap">
                <p>{text}</p>
            </div>
        </div>
    )
}