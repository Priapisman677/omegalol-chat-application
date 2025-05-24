import { Modal } from "@/components/authenticated/_chat/chat_header/modal/Modal"
import { render, screen } from "@testing-library/react"

import user from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { useState } from "react"


const users = [
    { id: 'user-1', username: 'alice' },
    { id: 'user-2', username: 'bob' },
    { id: 'user-3', username: 'charlie' }
]   

jest.mock('@/context/RoomContext', ()=>{
    return {
        __esModule: true,
        useRoomContext: ()=>{
            return {
                roomMeta:   
                    {
                        id: 'room-123',
                        roomName: 'General Chat',
                        isPrivate: false,
                        createdBy: {
                            id: 'user-1',
                            username: 'alice'
                        },
                        users
                    },
            }
        }
    }
})

jest.mock("@/context/session-context", ()=>{
    return {
        __esModule: true,
        useSession: ()=>{
            return {
                session: ''
            }
        }
    }
})

jest.mock('@/actions/room-actions/delete-user-from-room', ()=>{
    return {
        deleteUserFromRoom: jest.fn(),
        addIdToRoom: jest.fn()
    }
})

jest.mock('@/actions/redis-actions/search-users', ()=>{
    return {
        searchUsersRedis: jest.fn()
    }
})



jest.mock('@/components/authenticated/_chat/chat_header/modal/SearchBar', ()=>{
    return {
        __esModule: true,
        SearchBar: ()=> <div> Searchbar </div>
    }
})

const setModalOpen = jest.fn()
test('render', async ()=>{

    function ModalWrapper(){ //$ New: Element wrapper, accepted pattern to test state.
        //$ Creating their wrapper instead of just passing the state to the Modal will also let us test conditionally rendering the component based on modalOpen.
        const [modalOpen, setModalOpen] = useState(true);
        return modalOpen ? <Modal setModalOpen={setModalOpen}></Modal> : null
    }

    const {container} = render(<ModalWrapper />)

    const modalBackground = container.querySelector('div.fixed.inset-0.z-50')
    expect(modalBackground).toBeInTheDocument()

    const modalMainBox = container.querySelector('div.flex.flex-col.rounded')

    expect(modalMainBox).toBeInTheDocument()


    await user.click(modalBackground!) // * Closes modal

    // expect(setModalOpen).toHaveBeenCalledWith(false)
    //* Result of state change.
    expect(modalBackground).not.toBeInTheDocument() //$ The WRAPPER still exists but not the Modal!.

})

test('Should show users in room', ()=>{
    const {container} = render(<Modal setModalOpen={setModalOpen}></Modal>)

    users.forEach((user)=>{
        const userElement = screen.getByText(user.username)

        expect(userElement).toBeInTheDocument()
    })

    expect(container.querySelector('div.my-2.border-t')).toBeInTheDocument()

})