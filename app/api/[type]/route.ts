import { NextResponse } from "next/server"
import { newsData, artistsData, musicData, programsData, horoscopeData } from "../data"

export async function GET(request: Request, { params }: { params: { type: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "9")
  const id = searchParams.get("id")

  let data
  switch (params.type) {
    case "news":
      data = newsData
      break
    case "artists":
      data = artistsData
      break
    case "music":
      data = musicData
      break
    case "programs":
      data = programsData
      break
    case "horoscope":
      data = horoscopeData
      break
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }

  if (id) {
    const item = data.find((item) => item.id === Number.parseInt(id))
    return item ? NextResponse.json(item) : NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedData = data.slice(startIndex, endIndex)

  return NextResponse.json({
    items: paginatedData,
    hasMore: endIndex < data.length,
  })
}

