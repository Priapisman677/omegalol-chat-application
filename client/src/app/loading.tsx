"use client"

import { useEffect, useState } from "react"

const phrases = [
  "Decrypting human noise into meaningful echoes...",
  "Tuning frequencies... syncing strangers into shared silence."
]

export default function Loading() {
  const [phrase, setPhrase] = useState("")

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * phrases.length)
    setPhrase(phrases[randomIndex])
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-[#101011]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1500fa] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">{phrase}</p>
      </div>
    </div>
  )
}