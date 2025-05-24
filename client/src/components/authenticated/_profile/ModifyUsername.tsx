'use client';

import { updateProfileField } from '@/actions/user-actions/update-profile-field';
import { useSession } from '@/context/session-context';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPen } from 'react-icons/fa';

//prettier-ignore
export function  ModifyUsername() {

    const {session} = useSession()
    

    const [modifyName, setModifyName] = useState<boolean>(false)
    const[username, setUsername] = useState<string>(session!.username)
    
    const handleCancel = ()=>{
        setUsername(session!.username)
        setModifyName(false)
    }
    
    const handleSave = async ()=>{
        setModifyName(false)
        const result = await  updateProfileField({value: username, updateField: 'username'})
        
        if(!result.success){
            toast.error(result.msg)
            setUsername(session!.username)
            return
        }

        toast.success('Username updated')
        return
    }
    

    return (
        <div className='flex items-center'>
            {!modifyName && <h1 className="text-4xl">{username}</h1>}
            {!modifyName && <FaPen className="ml-2 text-xl text-gray-500 hover:cursor-pointer" onClick={()=>{setModifyName(true)}}></FaPen>}
            {modifyName &&
             <input 
                className="text-4xl border border-gray-500 rounded bg-[#1f1f20]" 
                type="text" value={username} 
                onChange={(e)=>{setUsername(e.target.value)}}
                onKeyDown={(e)=>{if(e.key === 'Enter') handleSave()}} />
            }
            {modifyName && (
                <div className="flex gap-4 ml-4 h-9 items center">
                    <button className=" px-3 py-2 text-white rounded bg-[#03a621] hover:bg-green-500 hover:cursor-pointer" onClick={handleSave}> Save</button>
                    <button className="px-3 py-2 text-white rounded bg-[#a60303] hover:bg-red-500 hover:cursor-pointer" onClick={handleCancel}> Cancel</button>
                </div>
            )}
        </div>
    )
}
