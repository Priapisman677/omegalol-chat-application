import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-[#222] text-sm text-gray-500 py-6 text-center space-x-4 max-h-[50px]">
            <Link href="/about" className="hover:underline">
				About
			</Link>
			<Link href="/contact" className="hover:underline">
				Contact
			</Link>
			<a href="https://github.com/Priapisman677" className="hover:underline" target="_blank" rel="noopener noreferrer">
				GitHub
			</a>
			<Link href="/privacy" className="hover:underline">
				Privacy
			</Link>
			<Link href="/" className="hover:underline">
				home
			</Link>
		</footer>
	);
}
