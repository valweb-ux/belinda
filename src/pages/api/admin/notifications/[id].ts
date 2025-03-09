import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Недійсний ID сповіщення" })
  }

  switch (req.method) {
    case "PUT":
      try {
        const { read } = req.body

        // Перевіряємо чи існує сповіщення
        const notification = await prisma.notification.findUnique({
          where: { id },
        })

        if (!notification) {
          return res.status(404).json({ error: "Сповіщення не знайдено" })
        }

        // Перевіряємо права доступу
        if (notification.userId !== req.user.id) {
          return res.status(403).json({
            error: "Недостатньо прав для оновлення сповіщення",
          })
        }

        // Оновлюємо статус сповіщення
        const updatedNotification = await prisma.notification.update({
          where: { id },
          data: { read },
        })

        res.status(200).json(updatedNotification)
      } catch (error) {
        console.error("Error updating notification:", error)
        res.status(500).json({ error: "Помилка оновлення сповіщення" })
      }
      break

    case "DELETE":
      try {
        // Перевіряємо чи існує сповіщення
        const notification = await prisma.notification.findUnique({
          where: { id },
        })

        if (!notification) {
          return res.status(404).json({ error: "Сповіщення не знайдено" })
        }

        // Перевіряємо права доступу
        if (notification.userId !== req.user.id) {
          return res.status(403).json({
            error: "Недостатньо прав для видалення сповіщення",
          })
        }

        // Видаляємо сповіщення
        await prisma.notification.delete({
          where: { id },
        })

        res.status(200).json({ message: "Сповіщення успішно видалено" })
      } catch (error) {
        console.error("Error deleting notification:", error)
        res.status(500).json({ error: "Помилка видалення сповіщення" })
      }
      break

    default:
      res.setHeader("Allow", ["PUT", "DELETE"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

