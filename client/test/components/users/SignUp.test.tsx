import SignUp from "@/app/(wall)/signup/page";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import '@testing-library/jest-dom'
import { signUp } from "@/actions/user-actions/sign-up";

jest.mock('@/actions/user-actions/sign-up', ()=>{
    return {
        __esModule: true,
        signUp: jest.fn()
    }
})

const  pushMock = jest.fn() //$ I declared it outside only because I want to use a matter with it.If I was to just mark it in order for the component to render, I wouldn't need to declare it outside.

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

test('Should render', async ()=>{
    //$ I saw this pattern by chatGPT many times and also used in this video https://www.youtube.com/watch?v=g3GFZx1KyWs&t=4565s 1:16:40

    //$ This is per test.

    //$ It tells the mock what to return in this specific case.

    //$ You might want different return values in different tests.

    (signUp as jest.Mock).mockResolvedValue({
        success: true,
        msg: 'User created successfully'
    })

    render(<SignUp></SignUp>)


    await user.type(screen.getByPlaceholderText('Username'), 'Miguel')
    await user.type(screen.getByPlaceholderText('Email'), 'noEditEmail@gmail')
    await user.type(screen.getByPlaceholderText('Password'), '12345678')
    await user.type(screen.getByPlaceholderText('Confirm Password'), '12345678')

    const button = screen.getByRole('button')

    await user.click(button)

    expect(signUp).toHaveBeenCalledWith({
        username: 'Miguel',
        email: 'noEditEmail@gmail',
        password: '12345678'
    })

    expect(await screen.findByText('User created successfully')).toBeInTheDocument()

    expect(pushMock).toHaveBeenCalledWith('/chat')  
})