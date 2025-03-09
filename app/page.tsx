"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import SearchModal from "@/components/SearchModal"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50">
        <TopNavBar />
        <MainMenu />
      </header>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-32">
        <AdBlock />
        {/* Новини section */}
        <section className="my-12 first:mt-48">
          <h2 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Новини
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 relative group">
              <Image
                src="https://kor.ill.in.ua/m/610x385/4293556.png"
                alt="Тіна Кароль готова представляти Україну на Євробаченні"
                width={815}
                height={458}
                className="w-full h-auto rounded-lg transition-transform duration-300 shadow-lg group-hover:shadow-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 rounded-b-lg">
                <h3 className="text-primary-foreground text-shadow text-2xl font-semibold line-clamp-2 group-hover:underline">
                  Тіна Кароль готова вдруге представляти Україну на Євробаченні
                </h3>
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <Image
                  src="https://kor.ill.in.ua/m/1260x900/3304717.jpg"
                  alt="Ріанна втретє вагітна"
                  width={395}
                  height={222}
                  className="w-full h-auto rounded-lg transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-primary-foreground text-shadow text-lg font-semibold line-clamp-2 group-hover:underline">
                    Зірковий бебібум: співачка Ріанна втретє вагітна
                  </h3>
                </div>
              </div>
              <div className="relative group">
                <Image
                  src="https://sjc.microlink.io/pLtP2D5GCjNnRhqdkdfn-8gaC5QYDS-9IQT2uooQ-qRY45Di50TfVVK1EAApA0z_7kb3CuUl6wZb2gOnu6IByg.jpeg"
                  alt="M Pokora анонсував новий альбом"
                  width={395}
                  height={222}
                  className="w-full h-auto rounded-lg transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-primary-foreground text-shadow text-lg font-semibold line-clamp-2 group-hover:underline">
                    M Pokora: нарешті відома дата виходу нового альбому "Adrenaline"
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button
              asChild
              variant="outline"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover-underline"
            >
              <Link href="/news">Більше новин</Link>
            </Button>
          </div>
        </section>

        {/* Гороскоп section */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Гороскоп
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/horoscope" className="md:col-span-2 relative group block">
              <Image
                src="https://sjc.microlink.io/uxQ0I1lCJHRCpfKpGpi4ulHFMEFMRUNz1g_kmRKyqqxEwuzB58NmcGBhekXLLKLbO9WEdk5OQDNUejU3z4blAA.jpeg"
                alt="Гороскоп на сьогодні"
                width={815}
                height={458}
                className="w-full h-auto rounded-lg transition-transform duration-300 shadow-lg group-hover:shadow-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 rounded-b-lg">
                <h3 className="text-primary-foreground text-shadow text-2xl font-semibold line-clamp-2 group-hover:underline">
                  Дізнайтеся, що зірки приготували для вас сьогодні
                </h3>
              </div>
            </Link>
            <div className="space-y-6 hidden md:block">
              <Link href="/horoscope/aries" className="relative group block">
                <Image
                  src="https://img.nrj.fr/BojP7OTdo_qcUjV3oLB9K1ZXM6M=/395x222/smart/medias%2F2025%2F02%2Fx2ujpys1nt3l-eliw3g4v2yubugmiypmedm9y8pph8_67a0d1fe10fdb.png"
                  alt="Гороскоп для Овна"
                  width={395}
                  height={222}
                  className="w-full h-auto rounded-lg transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-primary-foreground text-shadow text-lg font-semibold line-clamp-2 group-hover:underline">
                    Гороскоп для Овна
                  </h3>
                </div>
              </Link>
              <Link href="/horoscope/taurus" className="relative group block">
                <Image
                  src="https://img.nrj.fr/BojP7OTdo_qcUjV3oLB9K1ZXM6M=/395x222/smart/medias%2F2025%2F02%2Fx2ujpys1nt3l-eliw3g4v2yubugmiypmedm9y8pph8_67a0d1fe10fdb.png"
                  alt="Гороскоп для Тельця"
                  width={395}
                  height={222}
                  className="w-full h-auto rounded-lg transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-primary-foreground text-shadow text-lg font-semibold line-clamp-2 group-hover:underline">
                    Гороскоп для Тельця
                  </h3>
                </div>
              </Link>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button
              asChild
              variant="outline"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover-underline"
            >
              <Link href="/horoscope">Читати гороскоп</Link>
            </Button>
          </div>
        </section>

        <AdBlock />

        {/* Нова музика section */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">
            Нова музика
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 group"
              >
                <Image
                  src="https://img.nrj.fr/BojP7OTdo_qcUjV3oLB9K1ZXM6M=/395x222/smart/medias%2F2025%2F02%2Fx2ujpys1nt3l-eliw3g4v2yubugmiypmedm9y8pph8_67a0d1fe10fdb.png"
                  alt={`Трек ${i}`}
                  width={395}
                  height={222}
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 rounded-b-lg">
                  <p className="text-primary-foreground text-shadow text-lg font-semibold line-clamp-2 group-hover:underline">
                    Виконавець - Назва треку {i}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              asChild
              variant="outline"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover-underline"
            >
              <Link href="/music">Більше музики</Link>
            </Button>
          </div>
        </section>

        {/* About station section */}
        <section className="my-12 bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-card-foreground">Шері ФМ Україна: хороша музика</h2>
          <p className="text-card-foreground/75">
            Слухайте онлайн, кліпи, новини, найрізноманітніша музика: живе прослуховування, подкасти, програми, відео,
            новини про знаменитостей, гороскопи.
          </p>
        </section>

        <AdBlock />
      </main>

      <BottomMenu />
      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}

