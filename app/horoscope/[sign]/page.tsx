"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/Breadcrumbs"

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

export default function HoroscopeSignPage() {
  const { sign } = useParams()
  const [currentDate, setCurrentDate] = useState("")
  const [horoscopeSign, setHoroscopeSign] = useState<(typeof horoscopeData)[0] | null>(null)
  const [prediction, setPrediction] = useState("")

  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" }))

    const foundSign = horoscopeData.find((item) => item.latinName === sign)
    setHoroscopeSign(foundSign || null)

    // Тут би мав бути запит до API для отримання прогнозу, але ми використаємо заглушку
    setPrediction(
      "Сьогодні зірки віщують вам успіх у всіх починаннях. Ваша енергія на піку, використайте це для досягнення цілей. Будьте відкриті до нових можливостей, вони можуть з'явитися з несподіваних джерел. У особистому житті очікується гармонія та взаєморозуміння.",
    )
  }, [sign])

  if (!horoscopeSign) {
    return <div>Знак зодіаку не знайдено</div>
  }

  const breadcrumbItems = [
    { label: "Головна", href: "/" },
    { label: "Гороскоп", href: "/horoscope" },
    { label: horoscopeSign.name, href: `/horoscope/${sign}` },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50">
        <TopNavBar />
        <MainMenu />
      </header>
      <div className="bg-gray-100 pt-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-6">
        <AdBlock />
        <section className="my-12">
          <h1 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Гороскоп для {horoscopeSign.name} на {currentDate}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-[300px] md:h-full">
              <Image
                src={`/placeholder.svg?height=400&width=600`}
                alt={horoscopeSign.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">{horoscopeSign.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{horoscopeSign.date}</p>
              <p className="text-base">{prediction}</p>
            </div>
          </div>
        </section>
        <AdBlock />
      </main>
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <BottomMenu />
      <Footer />
    </div>
  )
}

