import Image from "next/image"
import { notFound } from "next/navigation"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import Breadcrumbs from "@/components/Breadcrumbs"

// This would typically come from an API or database
const programsData = [
  {
    id: 1,
    title: "Прогноз погоди",
    description: "Щоденний прогноз погоди для світових столиць та міст України.",
    image: "/placeholder.svg?height=400&width=600",
    time: "Щогодини",
    fullDescription:
      "Наш щоденний прогноз погоди надає детальну інформацію про погодні умови в основних містах України та світових столицях. Ми використовуємо найсучасніші метеорологічні дані та технології для забезпечення точності наших прогнозів. Слухайте нас щогодини, щоб бути в курсі останніх змін погоди та планувати свій день відповідно.",
  },
  {
    id: 2,
    title: "Гороскоп на сьогодні",
    description: "Щоденний гороскоп для всіх знаків зодіаку.",
    image: "/placeholder.svg?height=400&width=600",
    time: "Щоранку о 7:00",
    fullDescription:
      "Наш щоденний гороскоп пропонує цікаві та надихаючі прогнози для всіх знаків зодіаку. Ми поєднуємо традиційну астрологію з сучасними інтерпретаціями, щоб допомогти нашим слухачам краще зрозуміти себе та навколишній світ.",
  },
  {
    id: 3,
    title: "Новини шоубізнесу",
    description: "Останні новини зі світу шоубізнесу та розваг.",
    image: "/placeholder.svg?height=400&width=600",
    time: "Щодня о 12:00 та 18:00",
    fullDescription:
      "Наша програма 'Новини шоубізнесу' тримає вас в курсі всіх останніх подій у світі розваг. Ми висвітлюємо найгарячіші новини про зірок, нові релізи, церемонії нагородження та багато іншого.",
  },
  {
    id: 4,
    title: "Жіночі поради",
    description: "Корисні поради та інформація для жіночої аудиторії.",
    image: "/placeholder.svg?height=400&width=600",
    time: "Щовівторка та щочетверга о 15:00",
    fullDescription:
      "Програма 'Жіночі поради' пропонує широкий спектр корисної інформації для сучасних жінок. Ми обговорюємо теми здоров'я, краси, кар'єри, відносин та особистого розвитку, запрошуючи експертів та ділячись історіями успіху.",
  },
  {
    id: 5,
    title: "Музичний хіт-парад",
    description: "Топ-10 найпопулярніших пісень тижня.",
    image: "/placeholder.svg?height=400&width=600",
    time: "Щоп'ятниці о 19:00",
    fullDescription:
      "Наш щотижневий музичний хіт-парад представляє топ-10 найпопулярніших пісень. Ми аналізуємо чарти, враховуємо запити слухачів та оцінюємо нові релізи, щоб представити вам найактуальнішу музику тижня.",
  },
  {
    id: 6,
    title: "Інтерв'ю зі зірками",
    description: "Ексклюзивні інтерв'ю з українськими та світовими зірками.",
    image: "/placeholder.svg?height=400&width=600",
    time: "Щосуботи о 14:00",
    fullDescription:
      "У програмі 'Інтерв'ю зі зірками' ми запрошуємо відомих особистостей зі світу музики, кіно, телебачення та інших сфер. Наші гості діляться своїми історіями успіху, творчими планами та особистими переживаннями, даючи слухачам унікальну можливість зазирнути за лаштунки життя знаменитостей.",
  },
]

export default function ProgramPage({ params }: { params: { id: string } }) {
  const program = programsData.find((p) => p.id === Number.parseInt(params.id))

  if (!program) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Головна", href: "/" },
    { label: "Програми", href: "/programs" },
    { label: program.title, href: `/programs/${program.id}` },
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
            {program.title}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[300px] md:h-full">
              <Image
                src={program.image || "/placeholder.svg"}
                alt={program.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg font-semibold">Час виходу: {program.time}</p>
              <p>{program.fullDescription}</p>
            </div>
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

