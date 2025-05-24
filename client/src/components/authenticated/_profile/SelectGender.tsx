"use client"
import { useState } from "react"
import { MdOutlineMale } from "react-icons/md"
import { FaGenderless } from "react-icons/fa6"
import { IoMdFemale } from "react-icons/io"
import { useSession } from "@/context/session-context"
import { updateProfileField } from "@/actions/user-actions/update-profile-field"
import { SmallChangeButton } from "./SmallChangeButton"
import toast from "react-hot-toast"

type Gender = "male" | "female" | "unknown"

export function SelectGender() {
  const { session } = useSession()
  const initial: Gender = (session?.gender as Gender) ?? "unknown"

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Gender>(initial)

  const icons: Record<Gender, React.JSX.Element> = {
    male:    <MdOutlineMale    size={32} className="text-blue-400 cursor-pointer" title="male"/>,
    female:  <IoMdFemale       size={30} className="text-pink-500 cursor-pointer" title="female" />,
    unknown: <FaGenderless    size={25} className="cursor-pointer" title="unknown gender"/>,
  }

  const handleSelect = async (g: Gender) => {
    setSelected(g)
    setIsOpen(false)
    const result = await updateProfileField({ value: g, updateField: "gender" })

    if(!result.success){
        toast.error(result.msg)
        return
    }
    toast.success('Country updated')

  }

  return (
    <div className="inline-block">
      {isOpen ? (
        <div className="flex flex-col items-center space-y-2 rounded shadow bg-gray-900 border border-gray-700">
          {(["male","female","unknown"] as const).map(g => (
            <div key={g} onClick={() => handleSelect(g)}>
              {icons[g]}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
          <p> Gender: </p>
          <p className="font-bold hover:cursor-pointer">
            {selected.charAt(0).toUpperCase() + selected.slice(1)}
          </p>
          {icons[selected] }
          <SmallChangeButton></SmallChangeButton>
        </div>
      )}
    </div>
  )
}
