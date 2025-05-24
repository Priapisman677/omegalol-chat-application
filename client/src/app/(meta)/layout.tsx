import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar/Navbar';


export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

    return (
        <div className="flex h-full ">
            <div className="flex flex-col w-full h-full">
                <Navbar></Navbar>
                <div className='flex justify-center items-center min-h-[85%]'>
                  {children}
                </div>
                <Footer></Footer>
            </div>
        </div>
    );
}





// import Navbar from "@/components/shared/Navbar/Navbar";


// export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
//   return (
//     <>
//         <Navbar></Navbar>
//         <div className="flex justify-center items-center min-h-screen">
//           {children}
//         </div>
//     </>
//   );
// }
