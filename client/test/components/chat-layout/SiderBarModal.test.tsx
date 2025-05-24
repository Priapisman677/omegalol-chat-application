import { Modal } from "@/components/authenticated/side_bar/inner/Modal"
import { render, screen } from "@testing-library/react"
import user from "@testing-library/user-event";



const pushMock = jest.fn();
jest.mock('next/navigation', ()=>{
    return {
        __esModule: true,
        useRouter: ()=>{
            return {
                push: pushMock
            }
        }
    }
})


jest.mock('@/actions/room-actions/create-room', ()=>{
    return {
        __esModule: true,
        createRoom: ()=> Promise.resolve({success: true})
    }
})

test('It should call mutate', async ()=>{
    const mockMutate = jest.fn();
    render(<Modal modalOpen={true} setModalOpen={jest.fn()} mutate={mockMutate} />);
    // simulate whatever triggers mutate

    const input = screen.getByPlaceholderText('Room name')
    await user.type(input, 'Test room')

    const button = screen.getByRole('button', {
        name: 'Create'
    })
    
    await user.click(button)  

    expect(mockMutate).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
})