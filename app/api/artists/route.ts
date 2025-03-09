import { NextResponse } from "next/server"

// Імітація даних виконавців
const artistsData = [
  {
    id: 1,
    name: "Тіна Кароль",
    image: "https://kor.ill.in.ua/m/610x385/4293556.png",
    genre: "Поп",
  },
  {
    id: 2,
    name: "Океан Ельзи",
    image:
      "https://sjc.microlink.io/pLtP2D5GCjNnRhqdkdfn-8gaC5QYDS-9IQT2uooQ-qRY45Di50TfVVK1EAApA0z_7kb3CuUl6wZb2gOnu6IByg.jpeg",
    genre: "Рок",
  },
  {
    id: 3,
    name: "Джамала",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Поп, Джаз",
  },
  {
    id: 4,
    name: "The Hardkiss",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Рок, Альтернатива",
  },
  {
    id: 5,
    name: "KAZKA",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Поп, Електропоп",
  },
  {
    id: 6,
    name: "Антитіла",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Рок, Поп-рок",
  },
  {
    id: 7,
    name: "Alyona Alyona",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Хіп-хоп",
  },
  {
    id: 8,
    name: "ONUKA",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Електроніка, Фолк",
  },
  {
    id: 9,
    name: "Время и Стекло",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Поп",
  },
  {
    id: 10,
    name: "ДахаБраха",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Етно, World Music",
  },
  {
    id: 11,
    name: "Бумбокс",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Фанк, Хіп-хоп",
  },
  {
    id: 12,
    name: "Go_A",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Електро-фолк",
  },
  {
    id: 13,
    name: "Один в каное",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Інді-рок",
  },
  {
    id: 14,
    name: "MONATIK",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Поп, R&B",
  },
  {
    id: 15,
    name: "Pianoбой",
    image: "/placeholder.svg?height=385&width=610",
    genre: "Поп-рок",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedArtists = artistsData.slice(startIndex, endIndex)

  return NextResponse.json({
    artists: paginatedArtists,
    hasMore: endIndex < artistsData.length,
  })
}

