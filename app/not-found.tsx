import Link from "next/link"
import { Button } from "@/components/ui/button"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopNavBar />
      <MainMenu />
      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Сторінку не знайдено</h1>
        <p className="mb-8">Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена.</p>
        <Button asChild>
          <Link href="/">Повернутися на головну</Link>
        </Button>
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

