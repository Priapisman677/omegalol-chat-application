"use client"

import Link from 'next/link';

export default function HomePage() {



  return (
    <>
      <div className="bg-[#101011] flex-1 text-white px-4 py-16 flex flex-col w-full h-full">
        <div className="w-full  text-center flex flex-col gap-6">
          <h1 className="text-4xl font-bold">Welcome to Omegalol</h1>

          <p className="text-gray-400 text-lg">
            Jump into the conversation — chat globally, meet someone new, or start your own private room.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/global">
              <button className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-500 w-full sm:w-auto">Global Chat</button>
            </Link>
            <Link href="/random">
              <button className="bg-green-600 px-6 py-3 rounded hover:bg-green-500 w-full sm:w-auto">Random Match</button>
            </Link>
            <Link href="/chat">
              <button className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-500 w-full sm:w-auto">Private Rooms</button>
            </Link>
          </div>

          <div className="aspect-video w-[80%] max-w-3xl mx-auto h-[400px] ">
            <iframe
              className="w-full h-full rounded border border-[#333]"
              src="https://www.youtube.com/embed/1tHXYV41Kls"
              title="App Overview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

        </div>
      </div>
    </>
  );
}
