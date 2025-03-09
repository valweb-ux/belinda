import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Позначаємо всі сповіщення користувача як прочитані
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    res.status(200).json({
      message: "Всі сповіщення позначено як прочитані",
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    res.status(500).json({
      error: "Помилка оновлення статусу сповіщень",
    })
  }
}

export default authMiddleware(handler)

