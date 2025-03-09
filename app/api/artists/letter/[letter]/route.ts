import { NextResponse } from "next/server"

// Імітація даних виконавців
const artistsData = [
  { id: 1, name: "Антитіла" },
  { id: 2, name: "Арсен Мірзоян" },
  { id: 3, name: "Бумбокс" },
  { id: 4, name: "Вакарчук Святослав" },
  { id: 5, name: "Винник Олег" },
  { id: 6, name: "Гайтана" },
  { id: 7, name: "Джамала" },
  { id: 8, name: "Дорофєєва Надя" },
  { id: 9, name: "Дзідзьо" },
  { id: 10, name: "Еліна Іващенко" },
  { id: 11, name: "Єгор Крід" },
  { id: 12, name: "Жадан Сергій" },
  { id: 13, name: "Заліско Христина" },
  { id: 14, name: "Іванчукова Юлія" },
  { id: 15, name: "Їжак Сашко" },
]

export async function GET(request: Request, { params }: { params: { letter: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const letter = params.letter.toUpperCase()

  const filteredArtists = artistsData.filter((artist) => artist.name.toUpperCase().startsWith(letter))
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedArtists = filteredArtists.slice(startIndex, endIndex)

  return NextResponse.json({
    artists: paginatedArtists,
    hasMore: endIndex < filteredArtists.length,
  })
}

