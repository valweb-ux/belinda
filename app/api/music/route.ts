import { NextResponse } from "next/server"

// Імітація даних музики
const musicData = [
  {
    id: 1,
    title: "Україна - це ти",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Тіна Кароль",
  },
  {
    id: 2,
    title: "Вільна",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Тіна Кароль",
  },
  {
    id: 3,
    title: "Океанами стали",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Океан Ельзи",
  },
  {
    id: 4,
    title: "Без бою",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Океан Ельзи",
  },
  {
    id: 5,
    title: "Шум",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Go_A",
  },
  {
    id: 6,
    title: "Соловей",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Go_A",
  },
  {
    id: 7,
    title: "Плакала",
    image: "/placeholder.svg?height=222&width=395",
    artist: "KAZKA",
  },
  {
    id: 8,
    title: "Мало тебе",
    image: "/placeholder.svg?height=222&width=395",
    artist: "ALEKSEEV",
  },
  {
    id: 9,
    title: "Тримай",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Христина Соловій",
  },
  {
    id: 10,
    title: "Мова тіла",
    image: "/placeholder.svg?height=222&width=395",
    artist: "MONATIK",
  },
  {
    id: 11,
    title: "Кохання",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Jamala",
  },
  {
    id: 12,
    title: "Обійми",
    image: "/placeholder.svg?height=222&width=395",
    artist: "Океан Ельзи",
  },
  // Додайте більше музичних треків за потреби
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "9")

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedMusic = musicData.slice(startIndex, endIndex)

  return NextResponse.json({
    music: paginatedMusic,
    hasMore: endIndex < musicData.length,
  })
}

