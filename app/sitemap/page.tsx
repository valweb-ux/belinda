import Link from "next/link"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

export default function SitemapPage() {
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
            Мапа сайту
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Головні розділи</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover-underline text-primary">
                    Головна
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover-underline text-primary">
                    Новини
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover-underline text-primary">
                    Програми
                  </Link>
                </li>
                <li>
                  <Link href="/artists" className="hover-underline text-primary">
                    Виконавці
                  </Link>
                </li>
                <li>
                  <Link href="/music" className="hover-underline text-primary">
                    Музика
                  </Link>
                </li>
                <li>
                  <Link href="/horoscope" className="hover-underline text-primary">
                    Гороскоп
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Інформація</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover-underline text-primary">
                    Про нас
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="hover-underline text-primary">
                    Контакти
                  </Link>
                </li>
                <li>
                  <Link href="/advertise" className="hover-underline text-primary">
                    Реклама
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover-underline text-primary">
                    Підтримка
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover-underline text-primary">
                    Правова інформація
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Спеціальні сторінки</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/sitemap" className="hover-underline text-primary">
                    Мапа сайту
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover-underline text-primary">
                    Пошук
                  </Link>
                </li>
              </ul>
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

