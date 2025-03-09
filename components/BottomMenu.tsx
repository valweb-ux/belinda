import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Youtube } from "lucide-react"

const BottomMenu = () => {
  const pathname = usePathname()

  return (
    <nav className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-full md:col-span-1">
            <Link
              href="/"
              className="text-3xl font-bold text-primary-foreground block mb-2"
              style={{
                fontFamily: "var(--font-montserrat)",
                textShadow: "0 0 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.9)",
              }}
            >
              Шері ФМ
            </Link>
            <span
              className="text-sm text-primary-foreground block mb-4"
              style={{ textShadow: "0 0 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.9)" }}
            >
              Відчуй гарну музику
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 col-span-full md:col-span-3">
            <div>
              <h3 className="text-lg font-bold mb-4">Про нас</h3>
              <nav className="space-y-2">
                <Link href="/about" className="block hover:text-primary transition-colors hover-underline">
                  Про станцію
                </Link>
                <Link href="/programs" className="block hover:text-primary transition-colors hover-underline">
                  Програми
                </Link>
                <Link href="/horoscope" className="block hover:text-primary transition-colors hover-underline">
                  Гороскоп
                </Link>
                <Link href="/artists" className="block hover:text-primary transition-colors hover-underline">
                  Виконавці
                </Link>
                <Link href="/music" className="block hover:text-primary transition-colors hover-underline">
                  Музика
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Інформація</h3>
              <nav className="space-y-2">
                <Link href="/contacts" className="block hover:text-primary transition-colors hover-underline">
                  Контакти
                </Link>
                <Link href="/advertise" className="block hover:text-primary transition-colors hover-underline">
                  Реклама
                </Link>
                <Link href="/legal" className="block hover:text-primary transition-colors hover-underline">
                  Правова інформація
                </Link>
                <Link href="/sitemap" className="block hover:text-primary transition-colors hover-underline">
                  Мапа сайту
                </Link>
              </nav>
            </div>
            <div className="col-span-full md:col-span-1">
              <h3 className="text-lg font-bold mb-4">Слідкуйте за нами</h3>
              <div className="flex space-x-4">
                <Link
                  href="https://www.facebook.com/cherieukraine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </Link>
                <Link
                  href="https://www.youtube.com/@cheriefm.ukraine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Youtube className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default BottomMenu

