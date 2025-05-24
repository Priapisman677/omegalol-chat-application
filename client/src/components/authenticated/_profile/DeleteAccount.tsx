"use client"

import { deleteAccount } from "@/actions/user-actions/delete-account"
import { useEffect, useRef, useState } from "react"

export function  DeleteAccount() {

	const [open, setOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState("")

	useEffect(()=>{
		if(open && inputRef.current) inputRef.current.focus()
	}, [open])

	const [password, setPassword] = useState("")

	const isDisabled = password.trim() === ""
    
	const handlDeleteAccount = async ()=>{
	
		const result = await deleteAccount(password)
	
		if(!result.success){
			setError(result.msg)
			return
		}


		return
	}

    //* Button and Modal
    return (
		<>
			{/* //* Modal */}
			{open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={()=>{setOpen(false)}}>
				
				<div className="flex flex-col items-center justify-center w-80 h-55 bg-[#101011] border border-[#212121] text-white p-6  rounded" onClick={(e)=>{e.stopPropagation()}}>
					
					<p className="w-[80%] text-center">Type your password to delete your account</p>

					<input ref={inputRef} className="mt-4 border border-[#373737] w-[80%] h-8 rounded-[7px] p-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} type="password" value={password} onKeyDown={(e) => {if(e.key === "Enter") handlDeleteAccount()}}/>
					
					<button className={`mt-4 px-3 py-2 text-white rounded hover:cursor-pointer transition
					${isDisabled ? "bg-[#3a0000] cursor-not-allowed" : "bg-[#a60303] hover:bg-red-500"}`} disabled={isDisabled} onClick={handlDeleteAccount}>Delete account</button>

					{error && <p className="mt-4 text-red-500">{error}</p>}
						
				</div>
			</div>
       		)}

			{/* //* Delete button */}
			<div className="absolute px-4 py-2 text-white bg-red-900 rounded bottom-10 right-10 hover:cursor-pointer hover:bg-red-800" onClick={() => setOpen(true)}> 
				Delete account
			</div>
		</>
    )

}