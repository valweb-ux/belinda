import Link from "next/link"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"

export default function LegalPage() {
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
            Правова інформація
          </h1>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Умови використання</h2>
            <p>
              Ласкаво просимо на веб-сайт Шері ФМ. Використовуючи цей сайт, ви погоджуєтесь дотримуватися цих умов
              використання. Якщо ви не згодні з будь-якою частиною цих умов, будь ласка, не використовуйте наш сайт.
            </p>

            <h2 className="text-2xl font-semibold">Авторські права</h2>
            <p>
              Весь вміст на цьому сайті, включаючи тексти, графіку, логотипи, аудіо кліпи, цифрові завантаження, та інші
              матеріали, є власністю Шері ФМ або наших ліцензіарів і захищений законами про авторське право.
            </p>

            <h2 className="text-2xl font-semibold">Обмеження відповідальності</h2>
            <p>
              Шері ФМ не несе відповідальності за будь-які прямі, непрямі, випадкові, наслідкові або штрафні збитки, що
              виникають в результаті вашого доступу до сайту або його використання.
            </p>

            <h2 className="text-2xl font-semibold">Політика конфіденційності</h2>
            <p>
              Ми поважаємо вашу приватність і зобов'язуємося захищати ваші особисті дані. Детальну інформацію про те, як
              ми збираємо, використовуємо та захищаємо ваші дані, можна знайти в нашій Політиці конфіденційності.
            </p>

            <h2 className="text-2xl font-semibold">Зміни до умов</h2>
            <p>
              Ми залишаємо за собою право змінювати ці умови в будь-який час. Ваше подальше використання сайту після
              внесення змін означає вашу згоду з новими умовами.
            </p>

            <h2 className="text-2xl font-semibold">Контактна інформація</h2>
            <p>
              Якщо у вас виникли питання щодо цих умов, будь ласка,{" "}
              <Link href="/contacts" className="text-primary hover:text-primary/80 transition-colors hover-underline">
                зв'яжіться з нами
              </Link>
              .
            </p>
          </div>
        </section>
        <AdBlock />
      </main>
      <BottomMenu />
      <Footer />
    </div>
  )
}

