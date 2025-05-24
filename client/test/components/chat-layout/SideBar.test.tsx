import {SideBar} from "@/components/authenticated/side_bar/inner/SideBar"
import { render, screen } from "@testing-library/react"
import user from '@testing-library/user-event'
import '@testing-library/jest-dom'

test('Should open sidebar when clicked on the hamburger button and close when clicked on the X button', async ()=>{
    const {container} = render((<SideBar setModalOpen={jest.fn()} rooms={[]} isLoading={false}></SideBar>))

    const openButton = container.querySelector('svg.lucide.lucide-menu.cursor-pointer')

    await user.click(openButton!)

    const input = screen.getByPlaceholderText('New conversation')

    expect(input).toBeVisible()

    await user.click(container.querySelector('.lucide.lucide-x.cursor-pointer')!)

    expect(input).not.toBeVisible()

})