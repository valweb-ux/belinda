import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const ads = await prisma.advertisement.findMany({
          orderBy: {
            startDate: "desc",
          },
        })
        res.status(200).json(ads)
      } catch (error) {
        console.error("Error fetching advertisements:", error)
        res.status(500).json({ error: "Помилка при отриманні реклами" })
      }
      break

    case "POST":
      try {
        const { title, type, url, startDate, endDate } = req.body

        // Validate input
        if (!title || !type || !url || !startDate || !endDate) {
          return res.status(400).json({ error: "Всі поля є обов'язковими" })
        }

        const ad = await prisma.advertisement.create({
          data: {
            title,
            type,
            url,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: "scheduled",
            impressions: 0,
            clicks: 0,
          },
        })
        res.status(201).json(ad)
      } catch (error) {
        console.error("Error creating advertisement:", error)
        res.status(500).json({ error: "Помилка при створенні реклами" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

