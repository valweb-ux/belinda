import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import { createBackup } from "../../../../utils/backup"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const backups = await prisma.backup.findMany({
          orderBy: {
            createdAt: "desc",
          },
        })

        res.status(200).json(backups)
      } catch (error) {
        console.error("Error fetching backups:", error)
        res.status(500).json({ error: "Помилка при отриманні резервних копій" })
      }
      break

    case "POST":
      try {
        // Перевіряємо права адміністратора
        if (req.user.role !== "admin") {
          return res.status(403).json({
            error: "Недостатньо прав для створення резервної копії",
          })
        }

        // Налаштовуємо відповідь для стрімінгу прогресу
        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        // Створюємо резервну копію з відстеженням прогресу
        const backup = await createBackup({
          onProgress: (progress) => {
            res.write(String(progress))
          },
        })

        // Зберігаємо інформацію про резервну копію
        await prisma.backup.create({
          data: {
            name: backup.name,
            path: backup.path,
            size: backup.size,
            type: "full",
            createdBy: req.user.id,
          },
        })

        // Логуємо створення резервної копії
        await prisma.systemLog.create({
          data: {
            level: "info",
            category: "backup",
            message: "Створено резервну копію",
            details: JSON.stringify(backup),
            userId: req.user.id,
            ip: req.socket.remoteAddress,
          },
        })

        res.end()
      } catch (error) {
        console.error("Error creating backup:", error)
        res.status(500).json({ error: "Помилка при створенні резервної копії" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

