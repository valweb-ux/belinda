import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const playlists = await prisma.playlist.findMany({
          include: {
            tracks: {
              include: {
                track: true,
              },
              orderBy: {
                position: "asc",
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        })

        const formattedPlaylists = playlists.map((playlist) => ({
          ...playlist,
          tracks: playlist.tracks.map((pt) => ({
            id: pt.track.id,
            title: pt.track.title,
            artist: pt.track.artist,
            duration: pt.track.duration,
            genre: pt.track.genre,
            playCount: pt.track.playCount,
          })),
        }))

        res.status(200).json(formattedPlaylists)
      } catch (error) {
        console.error("Error fetching playlists:", error)
        res.status(500).json({ error: "Помилка при отриманні плейлистів" })
      }
      break

    case "POST":
      try {
        const { name, description, schedule, tracks } = req.body

        const playlist = await prisma.playlist.create({
          data: {
            name,
            description,
            schedule,
            isActive: true,
            tracks: {
              create: tracks.map((track: any, index: number) => ({
                trackId: track.id,
                position: index,
              })),
            },
          },
        })

        res.status(201).json(playlist)
      } catch (error) {
        console.error("Error creating playlist:", error)
        res.status(500).json({ error: "Помилка при створенні плейлиста" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

