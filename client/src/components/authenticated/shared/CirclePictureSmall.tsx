"use client"

import Link from "next/link"


type Props = {
    src: string,
    proportions: number
    onClick?: () => void
    href?: string,
}

export function  CirclePictureSmall({src, href, proportions, onClick}: Props) {


    //$ I've been having issues with passing dynamic tailwind glasses so they need to be passed as a raw styles.
    const size = `${proportions * 4}px`  // Tailwind spacing unit is 0.25rem (4px)

    const Image =  (
        <div  style={{width: size, height: size}} onClick={onClick}
        className={`overflow-hidden border border-green-500 rounded-full hover:cursor-pointer shrink-0`}>
            <img src={src} alt="profile" className="object-cover w-full h-full"/>
        </div>
    )
                                    //* These 2 to open in new tab
    return href? <Link href={href} target="_blank" rel="noopener noreferrer">{Image} </Link> : Image
}