import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import { deleteFile } from "../../../../utils/storage"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Недійсний ID повідомлення" })
  }

  switch (req.method) {
    case "PUT":
      try {
        const { content } = req.body

        if (!content?.trim()) {
          return res.status(400).json({
            error: "Повідомлення не може бути порожнім",
          })
        }

        // Перевіряємо чи існує повідомлення
        const message = await prisma.chatMessage.findUnique({
          where: { id },
          include: { user: true },
        })

        if (!message) {
          return res.status(404).json({ error: "Повідомлення не знайдено" })
        }

        // Перевіряємо права на редагування
        if (message.userId !== req.user.id && req.user.role !== "admin") {
          return res.status(403).json({
            error: "Недостатньо прав для редагування повідомлення",
          })
        }

        // Оновлюємо повідомлення
        const updatedMessage = await prisma.chatMessage.update({
          where: { id },
          data: {
            content,
            updatedAt: new Date(),
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
            attachments: true,
          },
        })

        // Логуємо редагування
        await prisma.systemLog.create({
          data: {
            level: "info",
            category: "chat",
            message: "Повідомлення відредаговано",
            details: JSON.stringify({
              messageId: id,
              userId: req.user.id,
              oldContent: message.content,
              newContent: content,
            }),
            userId: req.user.id,
            ip: req.socket.remoteAddress,
          },
        })

        res.status(200).json(updatedMessage)
      } catch (error) {
        console.error("Error updating message:", error)
        res.status(500).json({ error: "Помилка оновлення повідомлення" })
      }
      break

    case "DELETE":
      try {
        // Перевіряємо чи існує повідомлення
        const message = await prisma.chatMessage.findUnique({
          where: { id },
          include: {
            user: true,
            attachments: true,
          },
        })

        if (!message) {
          return res.status(404).json({ error: "Повідомлення не знайдено" })
        }

        // Перевіряємо права на видалення
        if (message.userId !== req.user.id && req.user.role !== "admin") {
          return res.status(403).json({
            error: "Недостатньо прав для видалення повідомлення",
          })
        }

        // Видаляємо вкладення з хмарного сховища
        await Promise.all(message.attachments.map((attachment) => deleteFile(`/chat/${message.id}/${attachment.name}`)))

        // Видаляємо повідомлення з бази даних
        await prisma.chatMessage.delete({
          where: { id },
        })

        // Логуємо видалення
        await prisma.systemLog.create({
          data: {
            level: "warning",
            category: "chat",
            message: "Повідомлення видалено",
            details: JSON.stringify({
              messageId: id,
              userId: req.user.id,
              content: message.content,
              attachments: message.attachments.length,
            }),
            userId: req.user.id,
            ip: req.socket.remoteAddress,
          },
        })

        res.status(200).json({ message: "Повідомлення успішно видалено" })
      } catch (error) {
        console.error("Error deleting message:", error)
        res.status(500).json({ error: "Помилка видалення повідомлення" })
      }
      break

    default:
      res.setHeader("Allow", ["PUT", "DELETE"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

