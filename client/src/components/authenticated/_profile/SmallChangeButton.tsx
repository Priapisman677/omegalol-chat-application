"use client"

export function  SmallChangeButton({additionalClasses}: {additionalClasses?: string}) {
    return (
        <button className={` ${additionalClasses} text-[11px] px-2 py-[2px] bg-neutral-700 text-white rounded-md hover:bg-neutral-600 hover:cursor-pointer`}>
            Change
        </button>
    )
}