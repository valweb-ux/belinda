import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  switch (req.method) {
    case "GET":
      try {
        const playlist = await prisma.playlist.findUnique({
          where: { id: String(id) },
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
        })

        if (!playlist) {
          return res.status(404).json({ error: "Плейлист не знайдено" })
        }

        const formattedPlaylist = {
          ...playlist,
          tracks: playlist.tracks.map((pt) => ({
            id: pt.track.id,
            title: pt.track.title,
            artist: pt.track.artist,
            duration: pt.track.duration,
            genre: pt.track.genre,
            playCount: pt.track.playCount,
          })),
        }

        res.status(200).json(formattedPlaylist)
      } catch (error) {
        console.error("Error fetching playlist:", error)
        res.status(500).json({ error: "Помилка при отриманні плейлиста" })
      }
      break

    case "PUT":
      try {
        const { name, description, schedule, tracks, isActive } = req.body

        await prisma.$transaction(async (prisma) => {
          await prisma.playlistTrack.deleteMany({
            where: { playlistId: String(id) },
          })

          await prisma.playlist.update({
            where: { id: String(id) },
            data: {
              name,
              description,
              schedule,
              isActive,
              tracks: {
                create: tracks.map((track: any, index: number) => ({
                  trackId: track.id,
                  position: index,
                })),
              },
            },
          })
        })

        res.status(200).json({ message: "Плейлист оновлено успішно" })
      } catch (error) {
        console.error("Error updating playlist:", error)
        res.status(500).json({ error: "Помилка при оновленні плейлиста" })
      }
      break

    case "DELETE":
      try {
        await prisma.playlist.delete({
          where: { id: String(id) },
        })

        res.status(200).json({ message: "Плейлист видалено успішно" })
      } catch (error) {
        console.error("Error deleting playlist:", error)
        res.status(500).json({ error: "Помилка при видаленні плейлиста" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

