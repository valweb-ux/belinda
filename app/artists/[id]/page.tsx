"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/Breadcrumbs"

interface NewsItem {
  id: number
  title: string
  image: string
  date: string
}

interface MusicItem {
  id: number
  title: string
  image: string
}

interface Artist {
  id: number
  name: string
}

const ArtistPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [music, setMusic] = useState<MusicItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const fetchArtist = useCallback(async () => {
    try {
      const response = await fetch(`/api/artists/${id}`)
      const data = await response.json()
      setArtist(data.artist)
    } catch (error) {
      console.error("Error fetching artist:", error)
    }
  }, [id])

  const fetchNews = useCallback(
    async (isInitialLoad = false) => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/artists/${id}/news?page=${isInitialLoad ? 1 : page}&limit=9`)
        const data = await response.json()
        setNews((prevNews) => (isInitialLoad ? data.news : [...prevNews, ...data.news]))
        setHasMore(data.hasMore)
        setPage((prevPage) => (isInitialLoad ? 2 : prevPage + 1))
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [id, page],
  )

  const fetchMusic = useCallback(async () => {
    try {
      const response = await fetch(`/api/artists/${id}/music?limit=3`)
      const data = await response.json()
      setMusic(data.music)
    } catch (error) {
      console.error("Error fetching music:", error)
    }
  }, [id])

  useEffect(() => {
    fetchArtist()
    fetchNews(true)
    fetchMusic()
  }, [fetchArtist, fetchNews, fetchMusic])

  const breadcrumbItems = [
    { label: "Виконавці", href: "/artists" },
    { label: artist?.name || "Завантаження...", href: `/artists/${id}` },
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
            {artist?.name || "Завантаження..."}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link href={`/news/${item.id}`} key={item.id} className="block">
                <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-105">
                  <CardContent className="p-0 relative h-full">
                    <div className="relative h-56">
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
            ))}
          </div>
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => fetchNews()}
                disabled={isLoading}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Завантаження..." : "Завантажити більше новин"}
              </Button>
            </div>
          )}
        </section>
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Музика виконавця
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {music.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-transform duration-300 hover:scale-105">
                <CardContent className="p-0 relative">
                  <div className="relative h-48">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-2 text-shadow">{item.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => router.push(`/artists/${id}/music`)}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Більше музики
            </Button>
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

export default ArtistPage

