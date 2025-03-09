import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

const ITEMS_PER_PAGE = 20

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = "1", search = "", sortBy = "createdAt", order = "desc" } = req.query

  const currentPage = Number.parseInt(page as string)

  switch (req.method) {
    case "GET":
      try {
        const where = search
          ? {
              OR: [
                { title: { contains: search as string, mode: "insensitive" } },
                { artist: { contains: search as string, mode: "insensitive" } },
                { album: { contains: search as string, mode: "insensitive" } },
                { genre: { contains: search as string, mode: "insensitive" } },
              ],
            }
          : {}

        const [tracks, total] = await Promise.all([
          prisma.track.findMany({
            where,
            skip: (currentPage - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
            orderBy: {
              [sortBy as string]: order,
            },
          }),
          prisma.track.count({ where }),
        ])

        res.status(200).json({
          tracks,
          totalPages: Math.ceil(total / ITEMS_PER_PAGE),
          currentPage,
          total,
        })
      } catch (error) {
        console.error("Error fetching tracks:", error)
        res.status(500).json({ error: "Помилка при отриманні треків" })
      }
      break

    default:
      res.setHeader("Allow", ["GET"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

