import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { period = "24h" } = req.query

  try {
    const startDate = new Date()
    let interval: "hour" | "day"

    switch (period) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24)
        interval = "hour"
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        interval = "day"
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        interval = "day"
        break
      default:
        startDate.setHours(startDate.getHours() - 24)
        interval = "hour"
    }

    const listenerStats = await prisma.listenerStats.groupBy({
      by: ["timestamp"],
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      _avg: {
        count: true,
      },
      _max: {
        count: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    })

    const formattedStats = listenerStats.map((stat) => ({
      timestamp: stat.timestamp,
      count: stat._max.count,
      average: Math.round(stat._avg.count || 0),
    }))

    res.status(200).json(formattedStats)
  } catch (error) {
    console.error("Error fetching listener stats:", error)
    res.status(500).json({ error: "Помилка при отриманні статистики" })
  }
}

export default authMiddleware(handler)

