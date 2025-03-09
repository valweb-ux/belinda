import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../../lib/prisma"
import { authMiddleware } from "../../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  switch (req.method) {
    case "GET":
      try {
        const messages = await prisma.chatMessage.findMany({
          where: {
            OR: [{ fromUserId: String(userId) }, { toUserId: String(userId) }],
          },
          orderBy: {
            timestamp: "asc",
          },
          include: {
            fromUser: {
              select: {
                name: true,
              },
            },
          },
        })

        const formattedMessages = messages.map((message) => ({
          id: message.id,
          userId: message.fromUserId,
          userName: message.fromUser.name,
          content: message.content,
          timestamp: message.timestamp,
          isAdmin: message.fromUserId === "admin",
        }))

        res.status(200).json(formattedMessages)
      } catch (error) {
        console.error("Error fetching messages:", error)
        res.status(500).json({ error: "Помилка при отриманні повідомлень" })
      }
      break

    default:
      res.setHeader("Allow", ["GET"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

