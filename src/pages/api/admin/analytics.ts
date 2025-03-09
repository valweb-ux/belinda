import type { NextApiRequest, NextApiResponse } from "next"
import { authMiddleware } from "../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { period } = req.query

    // This is a mock implementation. In a real-world scenario, you would fetch this data from your database or analytics service.
    const mockData = {
      listeners: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000)),
      pageViews: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000)),
      dates: Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      }).reverse(),
    }

    res.status(200).json(mockData)
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

