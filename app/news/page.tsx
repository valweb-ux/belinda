"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

// This would typically come from an API or database
const newsData = [
  {
    id: 1,
    title: "Тіна Кароль анонсує новий альбом",
    image: "https://kor.ill.in.ua/m/610x385/4293556.png",
    date: "2025-02-13T14:30:00Z",
  },
  {
    id: 2,
    title: "Зірковий бебібум: співачка Ріанна втретє вагітна",
    image: "https://kor.ill.in.ua/m/1260x900/3304717.jpg",
    date: "2025-02-12T12:45:00Z",
  },
  {
    id: 3,
    title: 'M Pokora: нарешті відома дата виходу нового альбому "Adrenaline"',
    image:
      "https://sjc.microlink.io/pLtP2D5GCjNnRhqdkdfn-8gaC5QYDS-9IQT2uooQ-qRY45Di50TfVVK1EAApA0z_7kb3CuUl6wZb2gOnu6IByg.jpeg",
    date: "2025-02-11T10:15:00Z",
  },
  {
    id: 4,
    title: "Джамала анонсувала новий сингл",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-10T18:00:00Z",
  },
  {
    id: 5,
    title: "Океан Ельзи готується до світового туру",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-09T15:30:00Z",
  },
  {
    id: 6,
    title: "KAZKA презентувала кліп на нову пісню",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-08T13:00:00Z",
  },
  {
    id: 7,
    title: "The Hardkiss оголосили про випуск нового альбому",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-07T20:45:00Z",
  },
  {
    id: 8,
    title: "Alyona Alyona стала амбасадором міжнародного музичного фестивалю",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-06T18:15:00Z",
  },
  {
    id: 9,
    title: "ONUKA виступить на відкритті міжнародної виставки сучасного мистецтва",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-05T15:30:00Z",
  },
  {
    id: 10,
    title: "Время и Стекло анонсували возз'єднання гурту",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-04T22:00:00Z",
  },
  {
    id: 11,
    title: "ДахаБраха вирушає у тур Європою",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-03T19:30:00Z",
  },
  {
    id: 12,
    title: "Бумбокс презентував новий трек у колаборації з відомим джазовим музикантом",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-02T17:00:00Z",
  },
  {
    id: 13,
    title: "Христина Соловій випустила акустичний альбом",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-01T14:20:00Z",
  },
  {
    id: 14,
    title: "MONATIK став хедлайнером найбільшого музичного фестивалю України",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-31T11:45:00Z",
  },
  {
    id: 15,
    title: "Оля Полякова анонсувала серію концертів у підтримку нового альбому",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-30T09:30:00Z",
  },
  {
    id: 16,
    title: "Антитіла презентували документальний фільм про свій творчий шлях",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-29T16:15:00Z",
  },
  {
    id: 17,
    title: "Руслана готує нове шоу з використанням інноваційних технологій",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-28T13:50:00Z",
  },
]

function NewsCard({ item }: { item: (typeof newsData)[0] }) {
  return (
    <Link href={`/news/${item.id}`} className="block">
      <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-105">
        <CardContent className="p-0 relative h-full">
          <div className="relative h-48">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-lg font-semibold text-white line-clamp-2 text-shadow">{item.title}</h2>
            <p className="text-sm text-gray-300 mt-1">{new Date(item.date).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function NewsPage() {
  const [visibleNews, setVisibleNews] = useState(9)

  const loadMoreNews = () => {
    setVisibleNews((prev) => Math.min(prev + 6, newsData.length))
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
            Новини
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.slice(0, visibleNews).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
          {visibleNews < newsData.length && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMoreNews}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Завантажити більше новин
              </Button>
            </div>
          )}
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

