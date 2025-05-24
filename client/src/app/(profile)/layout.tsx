import Navbar from '@/components/shared/Navbar/Navbar';


export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

    return (
        <div className="flex h-full bg-[#19191d]">
            <div className="flex flex-col w-full h-full">
                <Navbar></Navbar>
                {children}
            </div>
        </div>
    );
}
