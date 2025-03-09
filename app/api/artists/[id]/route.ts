import { NextResponse } from "next/server"

// Імітація даних виконавців
const artistsData = [
  { id: 1, name: "Антитіла", image: "/placeholder.svg?height=385&width=610" },
  { id: 2, name: "Арсен Мірзоян", image: "/placeholder.svg?height=385&width=610" },
  { id: 3, name: "Бумбокс", image: "/placeholder.svg?height=385&width=610" },
  { id: 4, name: "Вакарчук Святослав", image: "/placeholder.svg?height=385&width=610" },
  { id: 5, name: "Винник Олег", image: "/placeholder.svg?height=385&width=610" },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const artist = artistsData.find((artist) => artist.id === id)

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 })
  }

  return NextResponse.json({ artist })
}

