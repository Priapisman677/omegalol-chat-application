"use client"
import { MdGroupAdd } from "react-icons/md";
import { Menu, X } from "lucide-react"
import { useState } from "react"
import UserRooms from "./UserRooms";
import { useSideBarContext } from "@/context/SideBarSWRcontext";

type SideBarProps = {
  setModalOpen: (open: boolean) => void;
  rooms: userRoom[] | undefined;
  errormsg?: string;
  isLoading: boolean;
};


//prettier-ignore
export  function SideBar ({setModalOpen , rooms, errormsg, isLoading}: SideBarProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true)



    //$Here we just re-name the "data" variable to "rooms":
    const {publicRooms} = useSideBarContext()

    return (
        <div className={`transition-all duration-100 ${isOpen ? 'w-[360px]' : "w-14"} h-full  bg-[#101011] overflow-hidden  max-w-[360px] `}>
             {isOpen ? (
              <div className="h-full flex flex-col ">      
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex justify-between">
                    <X size={25} className="cursor-pointer" onClick={() => setIsOpen(false)}/>
                    <div className="flex items-center gap-2 hover:cursor-pointer bg-[#231d6e] p-2 rounded-[15px]" onClick={() => setModalOpen(true)}>
                      <p className="text-sm underline">Create room</p>
                      <MdGroupAdd size={25}></MdGroupAdd>
                    </div>
                  </div>
                  {/* <input className="border border-[#373737] w-full h-8 rounded-[7px] p-2 text-sm" placeholder="Search messages"></input> */}
                </div>
                {/* //*  Scrollable area */}
                <div className="overflow-y-scroll gap-4 flex flex-col h-full custom-scrollbar pl-4">
                  {errormsg && <p>{errormsg}</p>}
                  {isLoading && <p>Loading...</p>}

                  <div className="flex items-center gap-2">
                    <p className="font-bold">Your Rooms</p>
                  </div>
                  {rooms && rooms.length > 0? <UserRooms rooms={rooms}></UserRooms>: <p className="text-sm text-gray-400"> You are not in a room yet, create or join one.</p>}

                  <div className="flex items-center gap-2">
                    <p className="font-bold">Public Rooms</p>
                  </div>
                  {publicRooms? <UserRooms rooms={publicRooms}></UserRooms>: <p>No rooms</p>}

                </div>
              </div>
             ) : (
                <div className="h-full flex items-center justify-center">
                  <Menu size={25} className="cursor-pointer" onClick={() => setIsOpen(true)}/>
                </div>
             )}
        </div>
    )
}