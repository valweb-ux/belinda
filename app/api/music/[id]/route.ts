import { NextResponse } from "next/server"

// Імітація даних музики
const musicData = [
  {
    id: 1,
    title: "Україна - це ти",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Тіна Кароль",
    description: "Патріотична пісня, яка оспівує красу та силу України.",
    youtubeLink: "https://www.youtube.com/watch?v=example1",
    spotifyLink: "https://open.spotify.com/track/example1",
  },
  {
    id: 2,
    title: "Вільна",
    image: "/placeholder.svg?height=400&width=400",
    artist: "Тіна Кароль",
    description: "Емоційна балада про свободу та незалежність.",
    youtubeLink: "https://www.youtube.com/watch?v=example2",
    spotifyLink: "https://open.spotify.com/track/example2",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const track = musicData.find((track) => track.id === id)

  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 })
  }

  return NextResponse.json(track)
}

