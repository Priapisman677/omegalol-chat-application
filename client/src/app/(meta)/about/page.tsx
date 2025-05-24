import Link from 'next/link';

//prettier-ignore
export default function AboutPage() {
	return (
		<div className="h-full flex flex-col bg-[#101011] text-white px-4">
			<main className="flex-1 flex flex-col items-center justify-center  mx-auto text-center py-20 space-y-8 px-30">
				<h1 className="text-4xl font-bold">About This App</h1>
				<p className="text-gray-400 text-lg">
                    This app is a anonymous, fast, modern platform for real-time conversation.
                </p>

                <p className="text-gray-400 text-lg">
                   Unlike outdated anonymous chat tools, this one is built with better performance, cleaner design, and a focus on accessibility.
                </p>
				<div className="flex flex-col sm:flex-row gap-4 mt-6">
					<Link href="/global">
                        <button className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-500">
                            Start Chatting
                        </button>
                    </Link>
                    <Link href="/contact">                
                        <button className="bg-[#222] px-6 py-3 rounded hover:bg-[#333]">
                            Contact Me
                        </button>
                    </Link>
				</div>
                <img className='w-[80%] mt-20' src="/techstack3.png"></img>
			</main>


		</div>
	);
}
