"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/Breadcrumbs"

interface Artist {
  id: number
  name: string
}

const ArtistsByLetterPage = () => {
  const { letter } = useParams()
  const [artists, setArtists] = useState<Artist[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const fetchArtists = useCallback(
    async (isInitialLoad = false) => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/artists/letter/${letter}?page=${isInitialLoad ? 1 : page}&limit=20`)
        const data = await response.json()
        setArtists((prevArtists) => (isInitialLoad ? data.artists : [...prevArtists, ...data.artists]))
        setHasMore(data.hasMore)
        setPage((prevPage) => (isInitialLoad ? 2 : prevPage + 1))
      } catch (error) {
        console.error("Error fetching artists:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [letter, page],
  )

  useEffect(() => {
    fetchArtists(true)
  }, [fetchArtists])

  const loadMoreArtists = () => {
    fetchArtists()
  }

  const breadcrumbItems = [
    { label: "Виконавці", href: "/artists" },
    { label: `Літера ${letter}`, href: `/artists/letter/${letter}` },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 shadow-md">
        <TopNavBar />
        <MainMenu />
      </header>
      <div className="pt-32 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-6">
        <AdBlock />
        <section className="my-12">
          <h1 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Виконавці на літеру {letter}
          </h1>
          <ul className="space-y-2">
            {artists.map((artist) => (
              <li key={artist.id} className="text-lg">
                <Link href={`/artists/${artist.id}`} className="text-primary hover:underline">
                  {artist.name}
                </Link>
              </li>
            ))}
          </ul>
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMoreArtists}
                disabled={isLoading}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Завантаження..." : "Завантажити більше виконавців"}
              </Button>
            </div>
          )}
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

export default ArtistsByLetterPage

