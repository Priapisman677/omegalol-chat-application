"use client"

export default function  CirclePictureLarge({src, htmlFor}: {src: string, htmlFor?: string}) {
    return (
        <label htmlFor={htmlFor} className="h-[150px] w-[150px] flex items-center" > 
            <div className="w-[90%] h-[90%] rounded-full overflow-hidden relative group hover:cursor-pointer">
                <img src={src} className="object-cover w-full h-full"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center transition bg-gray-500 bg-opacity-50 opacity-0 group-hover:opacity-100">
                    <div className="text-3xl">📷</div>
                    <span> Change picture</span>
                </div>
            </div>
        </label>
    )
}