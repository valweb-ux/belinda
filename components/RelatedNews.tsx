import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

// This would typically come from an API or database
const newsData = [
  {
    id: 1,
    title: "Тіна Кароль анонсує новий альбом",
    image: "https://kor.ill.in.ua/m/610x385/4293556.png",
    date: "2025-02-13T14:30:00Z",
    tags: ["Тіна Кароль", "новий альбом", "українська музика"],
  },
  // ... (інші новини)
]

interface RelatedNewsProps {
  currentNewsId: number
  tags: string[]
  limit?: number
}

export default function RelatedNews({ currentNewsId, tags, limit = 1 }: RelatedNewsProps) {
  const relatedNews = newsData
    .filter((item) => item.id !== currentNewsId && item.tags.some((tag) => tags.includes(tag)))
    .slice(0, limit)

  if (relatedNews.length === 0) {
    return null
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Рекомендована новина</h2>
      <div className="grid grid-cols-1 gap-6">
        {relatedNews.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`}>
            <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} layout="fill" objectFit="cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

