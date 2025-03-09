import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const artists = await prisma.artist.findMany({
          orderBy: {
            name: "asc",
          },
          include: {
            songs: true,
          },
        })
        res.status(200).json(artists)
      } catch (error) {
        res.status(500).json({ error: "Помилка при отриманні виконавців" })
      }
      break

    case "POST":
      try {
        const { name, bio, image, socialLinks } = req.body
        const artist = await prisma.artist.create({
          data: {
            name,
            bio,
            image,
            socialLinks,
          },
        })
        res.status(201).json(artist)
      } catch (error) {
        res.status(500).json({ error: "Помилка при створенні виконавця" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

