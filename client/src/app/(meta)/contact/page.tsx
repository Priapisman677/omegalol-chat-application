import Link from 'next/link';

//prettier-ignore
export default function ContactPage() {
	return (
		<div className="h-full flex flex-col bg-[#101011] text-white px-4 w-full">
			<main className="flex-1 flex flex-col items-center justify-center  text-center py-20 space-y-8 px-30">
				<h1 className="text-4xl font-bold">Contact Me</h1>

				<p className="text-gray-400 text-lg">
					Found a bug? Want to share feedback? Or just have a question about the app?
				</p>

				<p className="text-gray-400 text-lg">
					Send me an email — I read everything personally.
				</p>

				<div className="mt-6">
					<p className="text-sm uppercase tracking-wide text-gray-500 mb-1">Email</p>
					<p className="text-xl font-mono text-blue-400 select-all">
						omegalolpriapisman@proton.me
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 mt-6">
					<Link href="/">
						<button className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-500">
							Back Home
						</button>
					</Link>
					<Link href="/about">
						<button className="bg-[#222] px-6 py-3 rounded hover:bg-[#333]">
							About the App
						</button>
					</Link>
				</div>
			</main>
		</div>
	);
}
