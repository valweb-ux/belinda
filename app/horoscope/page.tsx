"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

const horoscopeData = [
  { name: "Овен", latinName: "aries", date: "21 березня - 19 квітня" },
  { name: "Телець", latinName: "taurus", date: "20 квітня - 20 травня" },
  { name: "Близнюки", latinName: "gemini", date: "21 травня - 20 червня" },
  { name: "Рак", latinName: "cancer", date: "21 червня - 22 липня" },
  { name: "Лев", latinName: "leo", date: "23 липня - 22 серпня" },
  { name: "Діва", latinName: "virgo", date: "23 серпня - 22 вересня" },
  { name: "Терези", latinName: "libra", date: "23 вересня - 22 жовтня" },
  { name: "Скорпіон", latinName: "scorpio", date: "23 жовтня - 21 листопада" },
  { name: "Стрілець", latinName: "sagittarius", date: "22 листопада - 21 грудня" },
  { name: "Козеріг", latinName: "capricorn", date: "22 грудня - 19 січня" },
  { name: "Водолій", latinName: "aquarius", date: "20 січня - 18 лютого" },
  { name: "Риби", latinName: "pisces", date: "19 лютого - 20 березня" },
]

function HoroscopeCard({ sign }: { sign: (typeof horoscopeData)[0] }) {
  return (
    <Link href={`/horoscope/${sign.latinName}`} className="block">
      <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-105">
        <CardContent className="p-0 relative h-full">
          <div className="relative h-48">
            <Image src={`/placeholder.svg?height=222&width=395`} alt={sign.name} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-lg font-semibold text-white line-clamp-2 text-shadow">{sign.name}</h2>
            <p className="text-sm text-gray-300 mt-1">{sign.date}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function HoroscopePage() {
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" }))
  }, [])

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
            Гороскоп на {currentDate}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {horoscopeData.map((sign, index) => (
              <>
                <HoroscopeCard key={sign.latinName} sign={sign} />
                {index === 5 && (
                  <div className="col-span-full my-6">
                    <AdBlock />
                  </div>
                )}
              </>
            ))}
          </div>
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

