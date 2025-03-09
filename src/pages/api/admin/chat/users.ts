import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        status: "active",
      },
      select: {
        id: true,
        name: true,
        status: true,
        lastMessage: true,
        lastMessageTime: true,
      },
      orderBy: {
        lastMessageTime: "desc",
      },
    })

    res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Помилка при отриманні користувачів" })
  }
}

export default authMiddleware(handler)

