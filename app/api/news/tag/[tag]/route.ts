import { NextResponse } from "next/server"

// Імітація даних новин
const newsData = [
  {
    id: 1,
    title: "Тіна Кароль анонсує новий альбом",
    image: "https://kor.ill.in.ua/m/610x385/4293556.png",
    date: "2025-02-13T14:30:00Z",
    tags: ["Тіна Кароль", "музика", "альбом"],
  },
  {
    id: 2,
    title: "Тіна Кароль виступить на благодійному концерті",
    image: "https://kor.ill.in.ua/m/1260x900/3304717.jpg",
    date: "2025-02-12T12:45:00Z",
    tags: ["Тіна Кароль", "концерт", "благодійність"],
  },
  {
    id: 3,
    title: "Новий кліп Тіни Кароль б'є рекорди переглядів",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-11T10:00:00Z",
    tags: ["Тіна Кароль", "кліп", "музика"],
  },
  // Add more news items with tags...
]

export async function GET(request: Request, { params }: { params: { tag: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "9")
  const tag = decodeURIComponent(params.tag)

  const filteredNews = newsData.filter((news) => news.tags.includes(tag))
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedNews = filteredNews.slice(startIndex, endIndex)

  return NextResponse.json({
    news: paginatedNews,
    hasMore: endIndex < filteredNews.length,
  })
}

