"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

interface MusicItem {
  id: number
  title: string
  artist: string
  image: string
  releaseYear: number
}

const exampleMusicData: MusicItem[] = [
  {
    id: 1,
    title: "Україна - це ти",
    artist: "Тіна Кароль",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2022,
  },
  {
    id: 2,
    title: "Вільна",
    artist: "Тіна Кароль",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2021,
  },
  {
    id: 3,
    title: "Океанами стали",
    artist: "Океан Ельзи",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2020,
  },
  {
    id: 4,
    title: "Без бою",
    artist: "Океан Ельзи",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2019,
  },
  {
    id: 5,
    title: "Шум",
    artist: "Go_A",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2018,
  },
  {
    id: 6,
    title: "Соловей",
    artist: "Go_A",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2017,
  },
  {
    id: 7,
    title: "Плакала",
    artist: "KAZKA",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2016,
  },
  {
    id: 8,
    title: "Мало тебе",
    artist: "ALEKSEEV",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2015,
  },
  {
    id: 9,
    title: "Тримай",
    artist: "Христина Соловій",
    image: "/placeholder.svg?height=222&width=395",
    releaseYear: 2014,
  },
].sort((a, b) => b.releaseYear - a.releaseYear)

function MusicCard({ item }: { item: MusicItem }) {
  return (
    <Link href={`/music/${item.id}`} className="block">
      <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-105">
        <CardContent className="p-0 relative h-full">
          <div className="relative h-48">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={`${item.artist} - ${item.title}`}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-xl font-bold text-white line-clamp-1 text-shadow">{item.artist}</h2>
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">{item.title}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function MusicPage() {
  const [music, setMusic] = useState<MusicItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(9)

  useEffect(() => {
    // Simulating API call with a timeout
    const timer = setTimeout(() => {
      setMusic(exampleMusicData)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const loadMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 9, exampleMusicData.length))
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
            Музика
          </h1>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : music.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {music.slice(0, visibleCount).map((item) => (
                  <MusicCard key={item.id} item={item} />
                ))}
              </div>
              {visibleCount < music.length && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Завантажити більше музики
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">На даний момент музичних треків немає.</p>
          )}
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

