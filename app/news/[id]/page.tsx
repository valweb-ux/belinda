import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import TopNavBar from "@/components/TopNavBar"
import MainMenu from "@/components/MainMenu"
import Breadcrumbs from "@/components/Breadcrumbs"
import AdBlock from "@/components/AdBlock"
import BottomMenu from "@/components/BottomMenu"
import Footer from "@/components/Footer"
import SocialShareButtons from "@/components/SocialShareButtons"
import RelatedNews from "@/components/RelatedNews"

// This would typically come from an API or database
const newsData = [
  {
    id: 1,
    title: "Тіна Кароль анонсує новий альбом",
    image: "https://kor.ill.in.ua/m/610x385/4293556.png",
    date: "2025-02-13T14:30:00Z",
    content: [
      "Відома українська співачка Тіна Кароль оголосила про випуск свого нового альбому. За словами артистки, новий альбом буде відображати її творчу еволюцію та містити композиції різних жанрів.",
      "Реліз запланований на осінь цього року. В альбом увійдуть 12 нових пісень, над якими співачка працювала протягом останнього року.",
      "«Цей альбом - новий етап у моїй творчості. Кожна пісня - це історія, яку я хочу розповісти своїм слухачам», - поділилася Тіна Кароль.",
    ],
    tags: ["Тіна Кароль", "новий альбом", "українська музика"],
    category: "Зіркові новини",
  },
  {
    id: 2,
    title: "Зірковий бебібум: співачка Ріанна втретє вагітна",
    image: "https://kor.ill.in.ua/m/1260x900/3304717.jpg",
    date: "2025-02-12T12:45:00Z",
    content: [
      "Всесвітньо відома співачка Ріанна оголосила про свою третю вагітність, викликавши хвилю захоплення серед фанатів.",
      "Новина про поповнення в родині зірки з'явилася після її виступу на престижній музичній премії, де Ріанна продемонструвала помітно округлений животик.",
      "«Ми з A$AP Rocky неймовірно щасливі поділитися цією новиною з усіма. Наша сім'я росте, і ми дуже вдячні за цей дар», - поділилася Ріанна в своєму Instagram.",
    ],
    tags: ["Ріанна", "вагітність", "зіркові сім'ї"],
    category: "Зіркові новини",
  },
  // Add more news items here...
]

export async function generateStaticParams() {
  return newsData.map((news) => ({
    id: news.id.toString(),
  }))
}

export default function NewsPage({ params }: { params: { id: string } }) {
  const newsItem = newsData.find((item) => item.id === Number(params.id))

  if (!newsItem) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Головна", href: "/" },
    { label: "Новини", href: "/news" },
    { label: newsItem.title, href: `/news/${newsItem.id}` },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavBar />
      <MainMenu />
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-6">
        <AdBlock />
        <article className="mt-8">
          <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
          <div className="flex items-center justify-between mb-4">
            <time dateTime={newsItem.date} className="text-sm text-muted-foreground">
              {new Date(newsItem.date).toLocaleDateString("uk-UA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <Badge>{newsItem.category}</Badge>
          </div>
          <div className="relative aspect-video w-full mb-6">
            <Image
              src={newsItem.image || "/placeholder.svg"}
              alt={newsItem.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              priority
            />
          </div>
          <div className="prose max-w-none mb-6">
            {newsItem.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6 mb-4">
            <h2 className="text-xl font-semibold mb-2">Теги</h2>
            <div className="flex flex-wrap gap-2">
              {newsItem.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  <Link href={`/news/tag/${encodeURIComponent(tag)}`} className="hover:text-primary">
                    {tag}
                  </Link>
                </Badge>
              ))}
            </div>
          </div>
          <SocialShareButtons title={newsItem.title} />
          <RelatedNews currentNewsId={newsItem.id} tags={newsItem.tags} limit={1} />
        </article>
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

