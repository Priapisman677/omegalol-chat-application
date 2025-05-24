import '@testing-library/jest-dom'
import Navbar from '@/components/shared/Navbar/Navbar'
import { render} from '@testing-library/react'
import user from '@testing-library/user-event'


jest.mock('@/context/session-context', ()=>{
    return {
        __esModule: true,
        useSession: ()=>{
            return {
                session: {
                    id: '123',
                    username: 'John',
                    email: 'johndoe@me.com',
                }
            }
        }
    }
})


test('All icons should render', ()=>{
    const {container} = render(<Navbar></Navbar>)

    const icons = container.querySelectorAll('svg')

    expect(icons.length).toBeGreaterThanOrEqual(3)

})

test('User drop down should open on hover, show options and close on mouse-leave', async ()=>{

    const {container} = render(<Navbar></Navbar>)

    const userSection = container.querySelector('div.h-full')
    

    expect(userSection).toBeInTheDocument()

    await user.hover(userSection!)

    const userOptions = container.querySelectorAll('div.px-4.py-2')

    expect(userOptions).toHaveLength(3)

    await user.unhover(userSection!)

    expect(userOptions[0]).not.toBeInTheDocument()

})