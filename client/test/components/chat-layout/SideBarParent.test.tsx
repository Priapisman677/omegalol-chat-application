import SideBarParent from '@/components/authenticated/side_bar/SideBarParent';
import { render, screen } from '@testing-library/react';
import {rest} from 'msw'
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { KeyedMutator } from 'swr';
import user from '@testing-library/user-event'

type SideBarParentProps = {
    setModalOpen: (open: boolean) => void;
    rooms?: userRoom[];
    errormsg?: string;
    isLoading: boolean;
  };

  type ModalProps = {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    mutate: KeyedMutator<ServerGetUserRooms>;
  };

jest.mock("@/components/authenticated/side_bar/inner/SideBar", () => {
    return {
        __esModule: true,
        //$ Props will be passed automatically when <SideBarParent> finds <SideBar>
        SideBar: (props: SideBarParentProps)=> {
            const rooms = props.rooms

            return(
            <div data-testid="sidebar" data-rooms={JSON.stringify(props.rooms)}>
                <button onClick={()=> props.setModalOpen(true)}>Open</button>
                //! Ignore error 
                {rooms && <p>{props.rooms[0].roomName}</p>}
            </div>
        )}
    } 
})

jest.mock('@/components/authenticated/side_bar/inner/Modal', ()=>{
    return {
        __esModule: true,
        //$ Props will be passed automatically when <SideBarParent> finds <Modal>
        Modal: (props: ModalProps)=>{
            return(
            <>
                {props.modalOpen ? <div>Modal</div> :  null}
            </>
        )
        }
    }
})

const server = setupServer(
    rest.get('http://localhost:' + process.env.NEXT_PUBLIC_INTERNAL_PORT + '/api/getuserrooms', (_req, res, ctx)=>{
        return res(
            ctx.json({rooms: [{id: 'r2', roomName: 'myRoom'}]})
        )
    })
)
beforeAll(() => {server.listen()})
afterAll(() => {server.close()})
afterEach(() => {server.resetHandlers()})


test('Should render and load data from SWR', async ()=>{

    render(<SideBarParent></SideBarParent>)

    const sideBar = screen.getByTestId('sidebar') 

    expect(sideBar).toBeInTheDocument()

    const roomName = await screen.findByText('myRoom')
    expect(roomName).toBeInTheDocument()

    //$This data depends asynchronously on the swr request
    expect(sideBar.dataset.rooms).toBe(JSON.stringify([{id: 'r2', roomName: 'myRoom'}]))
})


it("toggles Modal when setModalOpen is called", async () => {
    render(<SideBarParent />);
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Modal")).toBeInTheDocument();
  });