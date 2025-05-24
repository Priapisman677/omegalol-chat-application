"use client"

import { useState } from "react"
import CirclePictureLarge from "./CirclePictureLarge"

type Props = {
    fileUploader: (data: File)=> Promise<ActionResponse>,
    defaultPicturePath: string
}


export default function  ChangePictureShared({fileUploader, defaultPicturePath}: Props) {
    
    const [feedBack, setFeedBack] = useState<ActionResponse | null>(null)

    const [fileUrl, setFileUrl] = useState<string>(defaultPicturePath)

    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>)=>  {
        const selectedFile = e.target?.files?.[0];
        if(!selectedFile)return
        const url = URL.createObjectURL(selectedFile)
        setFileUrl(url)

        const result = await fileUploader(selectedFile)
        setFeedBack(result)
        setTimeout(() => {
            setFeedBack(null);
        }, 5000);
        return

    }

    return (
        <>
            <input className="hidden" type="file" name="file" id="file" onChange={(e)=>{uploadFile(e)}} accept="image/*"></input>
            <div className="flex flex-col items-center">
                <CirclePictureLarge src={fileUrl || defaultPicturePath} htmlFor="file"></CirclePictureLarge>
                <div className="flex flex-col items-center w-full">
                    {feedBack && !feedBack.success && <div className="text-red-500">{feedBack.msg}</div>}
                </div>
            </div>
            
        </>
    )
}