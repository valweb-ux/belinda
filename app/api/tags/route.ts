import { NextResponse } from "next/server"

// Імітація даних тегів
const tagsData = [
  { name: "Мадонна", count: 10 },
  { name: "концерт", count: 7 },
  { name: "таксі", count: 4 },
  { name: "музика", count: 15 },
  { name: "фестиваль", count: 8 },
  { name: "кіно", count: 6 },
  { name: "премія", count: 5 },
  { name: "альбом", count: 9 },
  { name: "тур", count: 3 },
  { name: "кліп", count: 11 },
]

export async function GET() {
  return NextResponse.json({ tags: tagsData })
}

