import { NextResponse } from "next/server"

// Імітація даних музики
const musicData = [
  {
    id: 1,
    artistId: 16,
    title: "Україна - це ти",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    artistId: 16,
    title: "Вільна",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    artistId: 16,
    title: "Намалюю тобі",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    artistId: 16,
    title: "Я все ще люблю",
    image: "/placeholder.svg?height=300&width=300",
  },
  // Додайте більше пісень для Тіни Кароль та інших виконавців
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")
  const artistId = Number.parseInt(params.id)

  const filteredMusic = musicData.filter((music) => music.artistId === artistId)
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedMusic = filteredMusic.slice(startIndex, endIndex)

  return NextResponse.json({
    music: paginatedMusic,
    hasMore: endIndex < filteredMusic.length,
  })
}

