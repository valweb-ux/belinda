import { NextResponse } from "next/server"

// Імітація даних новин
const newsData = [
  {
    id: 1,
    artistId: 16,
    title: "Тіна Кароль анонсує новий альбом",
    image: "https://kor.ill.in.ua/m/610x385/4293556.png",
    date: "2025-02-13T14:30:00Z",
  },
  {
    id: 2,
    artistId: 16,
    title: "Тіна Кароль виступить на благодійному концерті",
    image: "https://kor.ill.in.ua/m/1260x900/3304717.jpg",
    date: "2025-02-12T12:45:00Z",
  },
  {
    id: 3,
    artistId: 16,
    title: "Новий кліп Тіни Кароль б'є рекорди переглядів",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-11T10:00:00Z",
  },
  // Додайте більше новин для Тіни Кароль та інших виконавців
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "9")
  const artistId = Number.parseInt(params.id)

  const filteredNews = newsData.filter((news) => news.artistId === artistId)
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedNews = filteredNews.slice(startIndex, endIndex)

  return NextResponse.json({
    news: paginatedNews,
    hasMore: endIndex < filteredNews.length,
  })
}

