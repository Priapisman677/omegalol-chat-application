import { ChatHeader } from "@/components/authenticated/_chat/chat_header/ChatHeaderPrivate"
import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'



jest.mock('@/context/RoomContext', ()=>{
    return {
        __esModule: true,
        useRoomContext: ()=>{
            return {
                roomMeta: []
            }
        }
    }
})

jest.mock('@/actions/redis-actions/search-users', ()=>{
    return {
        searchUsersRedis: ()=> {

        }
    }
})

jest.mock('@/components/authenticated/_chat/chat_header/modal/Modal', ()=>{
    return {
        __esModule: true,
        Modal: ()=> <div> Hi </div>
    }
})


test('render', async ()=>{
    const {container} = render(<ChatHeader usersOnline={1}></ChatHeader>)
    
    const usersOnlineDiv = screen.getByText('1 online')
    
    expect(usersOnlineDiv).toBeInTheDocument()
    
    const roomIcon = container.querySelector('img.object-cover')
    expect(roomIcon).toBeInTheDocument() 
    await user.click(roomIcon!)

    const hiDiv = screen.getByText('Hi')
    
    expect(hiDiv).toBeInTheDocument()

})