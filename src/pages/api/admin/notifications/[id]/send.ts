import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../../lib/prisma"
import { authMiddleware } from "../../../../../middleware/auth"
import { sendNotification } from "../../../../../utils/notifications"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { id } = req.query

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: String(id) },
      include: {
        targetUsers: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!notification) {
      return res.status(404).json({ error: "Сповіщення не знайдено" })
    }

    if (notification.status === "sent") {
      return res.status(400).json({ error: "Сповіщення вже відправлено" })
    }

    // Визначаємо цільових користувачів
    let targetUserIds: string[] = []

    switch (notification.target) {
      case "all":
        const allUsers = await prisma.user.findMany({
          select: { id: true },
        })
        targetUserIds = allUsers.map((user) => user.id)
        break

      case "premium":
        const premiumUsers = await prisma.user.findMany({
          where: { subscription: { status: "active" } },
          select: { id: true },
        })
        targetUserIds = premiumUsers.map((user) => user.id)
        break

      case "free":
        const freeUsers = await prisma.user.findMany({
          where: {
            OR: [{ subscription: null }, { subscription: { status: "inactive" } }],
          },
          select: { id: true },
        })
        targetUserIds = freeUsers.map((user) => user.id)
        break

      case "specific":
        targetUserIds = notification.targetUsers.map((tu) => tu.userId)
        break
    }

    // Відправляємо сповіщення
    for (const userId of targetUserIds) {
      await sendNotification({
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
      })
    }

    // Оновлюємо статус сповіщення
    await prisma.notification.update({
      where: { id: String(id) },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    })

    // Логуємо відправку
    await prisma.systemLog.create({
      data: {
        level: "info",
        category: "notification",
        message: "Сповіщення відправлено",
        details: JSON.stringify({
          notificationId: id,
          targetCount: targetUserIds.length,
        }),
        userId: req.user.id,
        ip: req.socket.remoteAddress,
      },
    })

    res.status(200).json({
      message: "Сповіщення успішно відправлено",
      targetCount: targetUserIds.length,
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    res.status(500).json({ error: "Помилка при відправці сповіщення" })
  }
}

export default authMiddleware(handler)

