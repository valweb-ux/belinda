"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

const ArtistsPage = () => {
  const [ukrainianAlphabet] = useState("АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ".split(""))
  const [frenchAlphabet] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))
  const [availableLetters, setAvailableLetters] = useState<string[]>([])

  useEffect(() => {
    const fetchAvailableLetters = async () => {
      try {
        const response = await fetch("/api/artists/available-letters")
        const data = await response.json()
        setAvailableLetters(data.availableLetters)
      } catch (error) {
        console.error("Error fetching available letters:", error)
      }
    }

    fetchAvailableLetters()
  }, [])

  const renderAlphabetLinks = (alphabet: string[]) => {
    return alphabet.map((letter) => {
      const isAvailable = availableLetters.includes(letter)
      return (
        <Link
          key={`letter-${letter}`}
          href={isAvailable ? `/artists/letter/${letter}` : "#"}
          className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold transition-colors ${
            isAvailable
              ? "bg-primary text-primary-foreground hover:bg-primary/80"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          {letter}
        </Link>
      )
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50">
        <TopNavBar />
        <MainMenu />
      </header>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-32">
        <AdBlock />
        <section className="my-12">
          <h1 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Виконавці
          </h1>
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2">{renderAlphabetLinks(ukrainianAlphabet)}</div>
            </div>
            <div>
              <div className="flex flex-wrap gap-2">{renderAlphabetLinks(frenchAlphabet)}</div>
            </div>
          </div>
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

export default ArtistsPage

