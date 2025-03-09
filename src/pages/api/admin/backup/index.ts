import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import { createBackup } from "../../../../utils/backup"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const backups = await prisma.backup.findMany({
          orderBy: { createdAt: "desc" },
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

        const backup = await createBackup({
          type: "manual",
          userId: req.user.id,
        })

        // Логуємо створення резервної копії
        await prisma.systemLog.create({
          data: {
            level: "info",
            category: "backup",
            message: "Створено резервну копію",
            details: JSON.stringify({
              backupId: backup.id,
              filename: backup.filename,
            }),
            userId: req.user.id,
            ip: req.socket.remoteAddress,
          },
        })

        res.status(200).json(backup)
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

