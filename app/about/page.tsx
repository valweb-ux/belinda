import Image from "next/image"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import Link from "next/link"

export default function AboutPage() {
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
            Про Шері ФМ
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p>
                Ласкаво просимо на Шері ФМ – вашу улюблену українську радіостанцію, де звучить найкраща музика! Ми з
                гордістю представляємо плейлист, який охоплює найрізноманітніші жанри: від поп і соул до акустики, інді,
                поп-року та класики. Наші ефіри – це унікальне поєднання українських, французьких та міжнародних хітів,
                які обов'язково сподобаються вам.
              </p>
              <p>
                Серед наших топових виконавців ви знайдете таких зірок, як Ірина Білик, Kendji Girac, Lady Gaga, Mariah
                Carey, Monatik та Ed Sheeran.
              </p>
              <p>
                Наші програми створені, щоб робити ваш день яскравішим: щоденний прогноз погоди для світових столиць та
                міст України,{" "}
                <Link
                  href="/horoscope"
                  className="text-primary hover:text-primary/80 transition-colors hover-underline"
                >
                  гороскоп на сьогодні
                </Link>{" "}
                та{" "}
                <Link href="/news" className="text-primary hover:text-primary/80 transition-colors hover-underline">
                  новини шоубізнесу
                </Link>
                . На нашій сторінці новин ви завжди знайдете актуальну інформацію зі світу шоубізнесу, корисні поради
                для жінок та багато іншого цікавого контенту.
              </p>
              <p>
                Шері ФМ Україна – це більше, ніж просто радіостанція. Заснована в серці Бучі, ми швидко стали улюбленою
                радіостанцією для багатьох українців. Наша команда – це професіонали, які люблять свою справу та
                прагнуть створювати найкращий радіопродукт в Україні, орієнтований на жіночу аудиторію. Ми завжди
                відкриті до нових ідей та{" "}
                <Link
                  href="/advertise"
                  className="text-primary hover:text-primary/80 transition-colors hover-underline"
                >
                  співпраці
                </Link>
                , щоб робити Шері ФМ Україна ще кращим для вас.
              </p>
              <p className="font-semibold">Приєднуйтесь до нас і відчуйте гарну музику разом з Шері ФМ Україна!</p>
            </div>
            <div className="relative h-[300px] md:h-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Шері ФМ студія"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Наші особливості</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Різноманітність музичних жанрів: поп, соул, акустика, інді, поп-рок та класика</li>
              <li>Унікальне поєднання українських, французьких та міжнародних хітів</li>
              <li>Топові виконавці світового рівня</li>
              <li>Щоденні прогнози погоди для світових столиць та міст України</li>
              <li>Щоденний гороскоп</li>
              <li>Актуальні новини шоубізнесу</li>
              <li>Корисні поради та інформація для жіночої аудиторії</li>
              <li>Професійна команда з глибоким розумінням потреб наших слухачів</li>
            </ul>
          </section>
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

