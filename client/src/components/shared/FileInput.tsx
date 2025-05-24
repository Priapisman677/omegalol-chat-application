"use client"

import { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";

import { FileModalPrivate } from "../authenticated/_chat/chatInput/FileModalPrivate";
import { useSocket } from "@/context/generic-socket-context";
import { FileModalRandom } from "../random-chat/FileModalRandom";

//prettier-ignore

type FileInputProps = {
	insertMessage: (message: ClientPrivateMessage) => void;
    disabled?: boolean //* This is just for random chats.
};
export default function  FileInput({ insertMessage, disabled}: FileInputProps) {

    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement | null>(null); //$ ✅ inputRef.current lives across renders, the only purpose will be so that when we click outside the modal and closes, the selected file will be set to null.

    const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>)=>{

        const files = e.target.files 
        
        if(!files || files.length === 0 ) return
        setFile(files[0])
        setOpen(true)

        console.log('so far');
        

        return
    }
    
    const handleCloseModal = () => {
		setOpen(false);
		setFile(null);
		if (inputRef.current) {
			inputRef.current.value = ""; // 👈 reset input
		}
	};


    const socket = useSocket()
    //@ts-ignore
    const namespace = socket.nsp
    return (
        <>
            {open && namespace === "/private" &&
             <FileModalPrivate file={file} insertMessage={insertMessage} handleCloseModal={handleCloseModal}/>}
            {open && (namespace === "/random" || namespace === "/global") && <FileModalRandom file={file} insertMessage={insertMessage} handleCloseModal={handleCloseModal} /> }

            <input type="file" accept='image/*' id="file" className="hidden" onChange={handleSetFile} ref={inputRef} disabled={disabled}></input>
            <label htmlFor='file' className="flex items-center justify-center w-8 h-8 ">
                <CiImageOn className={`w-full h-full   ${ disabled ? 'hover:cursor-not-allowed text-[#333333]' : 'hover:cursor-pointer text-[#706e6e]'}`}></CiImageOn>
            </label>
        </>
    )
}


