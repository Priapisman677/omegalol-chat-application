import toast from "react-hot-toast";

export const invitedToRoomToast = async({roomId, username}: {roomId: string, username: string})=>{

    
    toast(
        (t) => (
            <div onClick={() => {window.open(`/chat/${roomId}`, '_blank'); toast.dismiss(t.id);}}
            className=" cursor-pointer transition z-50">
                <p className="text-gray-600 font-semibold">📩 <span className="text-black">{username}</span> invited to a room. Click to go!</p>
            </div>
        ),
        {duration: 8000} //$ or `Infinity` to wait until clicked.
    );

    return
}