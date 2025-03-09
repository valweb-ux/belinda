import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import LoadingState from "@/components/LoadingState"

// This would typically come from an API or database
const programsData = [
  {
    id: 1,
    title: "Прогноз погоди",
    description: "Щоденний прогноз погоди для світових столиць та міст України.",
    image: "/placeholder.svg?height=222&width=395",
    time: "Щогодини",
  },
  {
    id: 2,
    title: "Гороскоп на сьогодні",
    description: "Щоденний гороскоп для всіх знаків зодіаку.",
    image: "/placeholder.svg?height=222&width=395",
    time: "Щоранку о 7:00",
  },
  {
    id: 3,
    title: "Новини шоубізнесу",
    description: "Останні новини зі світу шоубізнесу та розваг.",
    image: "/placeholder.svg?height=222&width=395",
    time: "Щодня о 12:00 та 18:00",
  },
  {
    id: 4,
    title: "Жіночі поради",
    description: "Корисні поради та інформація для жіночої аудиторії.",
    image: "/placeholder.svg?height=222&width=395",
    time: "Щовівторка та щочетверга о 15:00",
  },
  {
    id: 5,
    title: "Музичний хіт-парад",
    description: "Топ-10 найпопулярніших пісень тижня.",
    image: "/placeholder.svg?height=222&width=395",
    time: "Щоп'ятниці о 19:00",
  },
  {
    id: 6,
    title: "Інтерв'ю зі зірками",
    description: "Ексклюзивні інтерв'ю з українськими та світовими зірками.",
    image: "/placeholder.svg?height=222&width=395",
    time: "Щосуботи о 14:00",
  },
]

function ProgramCard({ program }: { program: (typeof programsData)[0] }) {
  return (
    <Link href={`/programs/${program.id}`} className="block">
      <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-105">
        <CardContent className="p-0 relative h-full">
          <div className="relative h-48">
            <Image src={program.image || "/placeholder.svg"} alt={program.title} layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-lg font-semibold text-white line-clamp-2 text-shadow">{program.title}</h2>
            <p className="text-sm text-gray-300 mt-1">{program.time}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ProgramsPage() {
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
            Програми
          </h1>
          <Suspense fallback={<LoadingState />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programsData.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </Suspense>
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

