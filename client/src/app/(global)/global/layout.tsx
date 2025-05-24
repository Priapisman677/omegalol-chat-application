import Navbar from '@/components/shared/Navbar/Navbar';
import { SocketProvider } from '@/context/generic-socket-context';


export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <SocketProvider nameSpace='global' autoConnect={true} withCredentials={false}> 
                
                <div className="flex flex-col w-full h-full bg-[#19191d]">
                    <Navbar></Navbar>
                    {children}
                </div>

        </SocketProvider>
    );
}
