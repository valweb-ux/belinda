import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/Breadcrumbs"

// This would typically come from an API or database
const musicData = [
  {
    id: 1,
    title: "Україна - це ти",
    artist: "Тіна Кароль",
    releaseDate: "2022-05-15",
    album: "Красиво",
    description: "Патріотична пісня, яка оспівує красу та силу України.",
    youtubeEmbed: "https://www.youtube.com/embed/example1",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 2,
    title: "Вільна",
    artist: "Тіна Кароль",
    releaseDate: "2021-08-24",
    album: "Красиво",
    description: "Емоційна балада про свободу та незалежність.",
    youtubeEmbed: "https://www.youtube.com/embed/example2",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 3,
    title: "Океанами стали",
    artist: "Океан Ельзи",
    releaseDate: "2020-03-10",
    album: "Без меж",
    description: "Лірична пісня про кохання та розлуку.",
    youtubeEmbed: "https://www.youtube.com/embed/example3",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 4,
    title: "Без бою",
    artist: "Океан Ельзи",
    releaseDate: "2018-11-21",
    album: "Без меж",
    description: "Енергійна рок-пісня про силу духу та незламність.",
    youtubeEmbed: "https://www.youtube.com/embed/example4",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 5,
    title: "Шум",
    artist: "Go_A",
    releaseDate: "2021-02-04",
    album: "Шум",
    description: "Електрофолк-пісня, яка поєднує традиційні українські мотиви з сучасним звучанням.",
    youtubeEmbed: "https://www.youtube.com/embed/example5",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 6,
    title: "Соловей",
    artist: "Go_A",
    releaseDate: "2020-02-01",
    album: "Шум",
    description: "Фольк-електронна композиція, що розповідає історію кохання через образ солов'я.",
    youtubeEmbed: "https://www.youtube.com/embed/w4DXWMVpWGg?si=KEndir_ScDyBlGHl",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 7,
    title: "Гімн України",
    artist: "Тіна Кароль",
    releaseDate: "2022-08-24",
    album: "Патріотичні пісні",
    description: "Виконання державного гімну України.",
    youtubeEmbed: "https://www.youtube.com/embed/example7",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 8,
    title: "Червона рута",
    artist: "Океан Ельзи",
    releaseDate: "2019-06-01",
    album: "Улюблені хіти",
    description: "Кавер-версія легендарної української пісні.",
    youtubeEmbed: "https://www.youtube.com/embed/example8",
    image: "/placeholder.svg?height=222&width=395",
  },
  {
    id: 9,
    title: "Дика пташка",
    artist: "Go_A",
    releaseDate: "2022-03-15",
    album: "Шум",
    description: "Нова композиція, що поєднує фольклорні мотиви з сучасним звучанням.",
    youtubeEmbed: "https://www.youtube.com/embed/example9",
    image: "/placeholder.svg?height=222&width=395",
  },
]

function getRandomTracks(artist: string, currentTrackId: number, count: number) {
  const artistTracks = musicData.filter((track) => track.artist === artist && track.id !== currentTrackId)
  const shuffled = artistTracks.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default function MusicTrackPage({ params }: { params: { id: string } }) {
  const track = musicData.find((t) => t.id === Number.parseInt(params.id))

  if (!track) {
    notFound()
  }

  const randomTracks = getRandomTracks(track.artist, track.id, 3)

  const breadcrumbItems = [
    { label: "Головна", href: "/" },
    { label: "Музика", href: "/music" },
    { label: track.title, href: `/music/${track.id}` },
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
            {track.artist} - "{track.title}"
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video">
              <iframe
                src={track.youtubeEmbed}
                title={track.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-semibold">Виконавець: {track.artist}</p>
              <p className="text-lg font-semibold">Назва: {track.title}</p>
              <p className="text-lg">Альбом: {track.album}</p>
              <p className="text-lg">Дата випуску: {new Date(track.releaseDate).toLocaleDateString("uk-UA")}</p>
              <p>{track.description}</p>
            </div>
          </div>
        </section>
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Інші треки виконавця {track.artist}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {randomTracks.map((randomTrack) => (
              <Link key={randomTrack.id} href={`/music/${randomTrack.id}`} className="block">
                <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-105">
                  <CardContent className="p-0 relative h-full">
                    <div className="relative h-48">
                      <Image
                        src={randomTrack.image || "/placeholder.svg"}
                        alt={randomTrack.title}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-70"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white text-shadow">{randomTrack.artist}</h3>
                      <p className="text-sm text-white text-shadow mt-1">{randomTrack.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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

