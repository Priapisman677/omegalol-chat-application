'use client';

import Link from 'next/link';

export default function DuplicateConnection() {
	return (
		<div className="fixed animate-pulse inset-0 flex flex-col items-center justify-center text-center p-8">
			<h1 className="text-6xl mb-4 "> ☠️ </h1>
			<h2 className="text-3xl font-bold mb-2">
				Session Taken Over
			</h2>
			<p className="text-lg mb-6">
				You opened this chat in another tab. This one will now
				close.
			</p>

			<Link href="/chat">
				<button className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer">
					Use here
				</button>
			</Link>
		</div>
	);
}

//! It is important that in the shock socket hook you have this:
// if (!socket.connected) {
//   socket.connect(); // Ensure socket is connected when entering the page
// }
//- That is because when you click on the link to go back to /chat, the socket connection doens't retry because of a so far unknown reason 🤔💭.
//- It might be that context does not restart when you navigate BACK to a page using a <Link>
