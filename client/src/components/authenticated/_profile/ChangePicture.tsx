"use client"

import { uploadProfilePic } from "@/actions/user-actions/upload-profile-pic"
import { useSession } from "@/context/session-context"
import { internalBaseURL } from "@/lib/network"
import { useState } from "react"

export default function  ChangePicture() {
    const {session} = useSession()
    const imageSrc = session?.profilePicPath 
  	? new URL(`api/getprofileroomimage?imagename=${session.profilePicPath.split('/').pop()}&type=profile-pics`, internalBaseURL).href
 	: '/default-profile-pic.png';
    
    const [saveButton, setSaveButton] = useState<boolean>(false)
    const [feedBack, setFeedBack] = useState<ActionResponse | null>(null)

    const [fileUrl, setFileUrl] = useState<string | null>(session && imageSrc)
    const [file, setFile] = useState <File | undefined>(undefined)

    const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>)=>  {
        const selectedFile = e.target?.files?.[0];
        if(!selectedFile)return
        const url = URL.createObjectURL(selectedFile)
        setFile(selectedFile);  
        setFileUrl(url)
        setSaveButton(true)
    }

    const uploadFile = async ()=>{
        if(!file)return
        setSaveButton(false)
        const result = await uploadProfilePic(file)
        setFeedBack(result)
        setTimeout(() => {
            setFeedBack(null);
        }, 5000);
        return
    }

    const SaveButton = ()=> {
        return (
            <button onClick={uploadFile} className="px-3 py-2 text-white rounded bg-[#03a621] hover:bg-green-500 hover:cursor-pointer w-32 h-8 flex items-center justify-center">
                Save Photo
            </button>
        )
    }

    return (
        <>
            <input className="hidden" type="file" name="file" id="file" onChange={(e)=>{handleSetFile(e)}} accept="image/*"></input>
            <div className="flex flex-col items-center">
                <label htmlFor="file" className="h-[150px] w-[150px] flex items-center" > 
                    <div className="w-[90%] h-[90%] rounded-full overflow-hidden relative group hover:cursor-pointer">
                        <img src={fileUrl || '/default-profile-pic.png'} className="object-cover w-full h-full"/>
                        <div className="absolute inset-0 flex flex-col items-center justify-center transition bg-gray-500 bg-opacity-50 opacity-0 group-hover:opacity-100">
                            <div className="text-3xl">📷</div>
                            <span> Change picture</span>
                        </div>
                    </div>
                </label>
                <div className="flex flex-col items-center w-full">
                    {saveButton && <SaveButton></SaveButton>}
                    {feedBack && !feedBack.success && <div className="text-red-500">{feedBack.msg}</div>}
                </div>
            </div>
            
        </>
    )
}