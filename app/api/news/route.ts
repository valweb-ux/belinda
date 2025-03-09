import { NextResponse } from "next/server"

// Імітація даних новин
const newsData = [
  {
    id: 1,
    title: "Тіна Кароль анонсує новий альбом",
    image: "https://kor.ill.in.ua/m/610x385/4293556.png",
    date: "2025-02-13T14:30:00Z",
  },
  {
    id: 2,
    title: "Зірковий бебібум: співачка Ріанна втретє вагітна",
    image: "https://kor.ill.in.ua/m/1260x900/3304717.jpg",
    date: "2025-02-12T12:45:00Z",
  },
  {
    id: 3,
    title: 'M Pokora: нарешті відома дата виходу нового альбому "Adrenaline"',
    image:
      "https://sjc.microlink.io/pLtP2D5GCjNnRhqdkdfn-8gaC5QYDS-9IQT2uooQ-qRY45Di50TfVVK1EAApA0z_7kb3CuUl6wZb2gOnu6IByg.jpeg",
    date: "2025-02-11T10:15:00Z",
  },
  {
    id: 4,
    title: "Джамала анонсувала новий сингл",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-10T18:00:00Z",
  },
  {
    id: 5,
    title: "Океан Ельзи готується до світового туру",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-09T15:30:00Z",
  },
  {
    id: 6,
    title: "KAZKA презентувала кліп на нову пісню",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-08T13:00:00Z",
  },
  {
    id: 7,
    title: "The Hardkiss оголосили про випуск нового альбому",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-07T20:45:00Z",
  },
  {
    id: 8,
    title: "Alyona Alyona стала амбасадором міжнародного музичного фестивалю",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-06T18:15:00Z",
  },
  {
    id: 9,
    title: "ONUKA виступить на відкритті міжнародної виставки сучасного мистецтва",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-05T15:30:00Z",
  },
  {
    id: 10,
    title: "Время и Стекло анонсували возз'єднання гурту",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-04T22:00:00Z",
  },
  {
    id: 11,
    title: "ДахаБраха вирушає у тур Європою",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-03T19:30:00Z",
  },
  {
    id: 12,
    title: "Бумбокс презентував новий трек у колаборації з відомим джазовим музикантом",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-02T17:00:00Z",
  },
  {
    id: 13,
    title: "Христина Соловій випустила акустичний альбом",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-02-01T14:20:00Z",
  },
  {
    id: 14,
    title: "MONATIK став хедлайнером найбільшого музичного фестивалю України",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-31T11:45:00Z",
  },
  {
    id: 15,
    title: "Оля Полякова анонсувала серію концертів у підтримку нового альбому",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-30T09:30:00Z",
  },
  {
    id: 16,
    title: "Антитіла презентували документальний фільм про свій творчий шлях",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-29T16:15:00Z",
  },
  {
    id: 17,
    title: "Руслана готує нове шоу з використанням інноваційних технологій",
    image: "/placeholder.svg?height=385&width=610",
    date: "2025-01-28T13:50:00Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "9")

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const paginatedNews = newsData.slice(startIndex, endIndex)

    return NextResponse.json({
      news: paginatedNews,
      hasMore: endIndex < newsData.length,
    })
  } catch (error) {
    console.error("Error in news API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

