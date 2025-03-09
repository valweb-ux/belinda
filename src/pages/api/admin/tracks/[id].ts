import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  switch (req.method) {
    case "GET":
      try {
        const track = await prisma.track.findUnique({
          where: { id: String(id) },
        })

        if (!track) {
          return res.status(404).json({ error: "Трек не знайдено" })
        }

        res.status(200).json(track)
      } catch (error) {
        console.error("Error fetching track:", error)
        res.status(500).json({ error: "Помилка при отриманні треку" })
      }
      break

    case "PUT":
      try {
        const { title, artist, album, genre } = req.body

        const track = await prisma.track.update({
          where: { id: String(id) },
          data: {
            title,
            artist,
            album,
            genre,
            updatedAt: new Date(),
          },
        })

        res.status(200).json(track)
      } catch (error) {
        console.error("Error updating track:", error)
        res.status(500).json({ error: "Помилка при оновленні треку" })
      }
      break

    case "DELETE":
      try {
        await prisma.track.delete({
          where: { id: String(id) },
        })

        res.status(200).json({ message: "Трек видалено успішно" })
      } catch (error) {
        console.error("Error deleting track:", error)
        res.status(500).json({ error: "Помилка при видаленні треку" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

