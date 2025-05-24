"use client";
import { useState } from "react"
import {Modal} from "./inner/Modal";
import {SideBar} from "./inner/SideBar";
import { useSideBarContext } from "@/context/SideBarSWRcontext";


export default function  SideBarParent() {

	  const [modalOpen, setModalOpen] = useState(false)
    const {data, error, isLoading, mutate} = useSideBarContext()

    const rooms = data?.rooms

    return (
      <>
        <SideBar setModalOpen={setModalOpen} rooms={rooms} errormsg={error?.message} isLoading={isLoading} ></SideBar>
        {modalOpen && (
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} mutate={mutate}></Modal>
        )}
      </>
        
      )
}

