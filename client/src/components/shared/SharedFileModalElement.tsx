"use client"


type SharedFileModalProps = {
    handleCloseModal: () => void;
    handleFileSubmit: () => Promise<void>;
    url: string
}

export default function  SharedFileModalElement( {handleCloseModal, handleFileSubmit, url}: SharedFileModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseModal}>

            <div className="max-w-[90vw] max-h-[90vh] bg-[#131313] border border-[#202020] rounded p-4 flex flex-col"
                onClick={(e) => e.stopPropagation()}>

                {/* Image */}
                <div className="flex-grow mb-4 overflow-hidden flex items-center justify-center">
                    <img src={url} className="object-contain max-w-full max-h-[70vh]" alt="preview"/>
                </div>

                {/* Buttons */}
                <div className="flex justify-end">
                    <button className="px-3 h-7 rounded bg-green-700 hover:bg-green-600 cursor-pointer text-white" onClick={handleFileSubmit}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}