"use client"

export default function  UsersTyping({usersTyping} : {usersTyping: string[]}) {
    return (
        usersTyping.length > 0 && (
        <div className="flex text-sm text-gray-400 max-w-[500px] whitespace-nowrap overflow-hidden">
            <span className="truncate">
            {usersTyping.join(', ')}
            </span>
            <span className="pl-1 shrink-0">
            {usersTyping.length === 1 ? 'is typing...' : 'are typing...'}
            </span>
        </div>
        )
    )
}