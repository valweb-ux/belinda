import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

export default function AdvertisePage() {
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
            Реклама на Шері ФМ
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p>
                Шері ФМ пропонує ефективні рекламні можливості для вашого бізнесу. Наша аудиторія - це активні,
                платоспроможні жінки віком від 25 до 45 років, які цікавляться модою, красою, здоров'ям та культурою.
              </p>
              <h2 className="text-2xl font-semibold mt-6">Наші рекламні пропозиції включають:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Аудіо-реклама в ефірі</li>
                <li>Спонсорство програм</li>
                <li>Банерна реклама на сайті</li>
                <li>Нативна реклама в наших соціальних мережах</li>
                <li>Участь у наших заходах та акціях</li>
              </ul>
              <p>
                Ми пропонуємо індивідуальний підхід до кожного клієнта та допоможемо вам розробити ефективну рекламну
                кампанію, яка досягне вашої цільової аудиторії.
              </p>
              <div className="mt-8">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/contacts">Зв'яжіться з нами для отримання комерційної пропозиції</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Реклама на Шері ФМ"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
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

