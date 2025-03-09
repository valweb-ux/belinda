import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../../lib/prisma"
import { authMiddleware } from "../../../../../middleware/auth"
import { restoreFromBackup } from "../../../../../utils/backup"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { id } = req.query

  try {
    // Перевіряємо права адміністратора
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Недостатньо прав для відновлення з резервної копії",
      })
    }

    // Отримуємо інформацію про резервну копію
    const backup = await prisma.backup.findUnique({
      where: { id: String(id) },
    })

    if (!backup) {
      return res.status(404).json({ error: "Резервну копію не знайдено" })
    }

    // Налаштовуємо відповідь для стрімінгу прогресу
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    // Відновлюємо з резервної копії з відстеженням прогресу
    await restoreFromBackup({
      backupPath: backup.path,
      onProgress: (progress) => {
        res.write(String(progress))
      },
    })

    // Логуємо відновлення
    await prisma.systemLog.create({
      data: {
        level: "info",
        category: "backup",
        message: "Відновлено з резервної копії",
        details: JSON.stringify({
          backupId: id,
          backupName: backup.name,
        }),
        userId: req.user.id,
        ip: req.socket.remoteAddress,
      },
    })

    res.end()
  } catch (error) {
    console.error("Error restoring from backup:", error)
    res.status(500).json({ error: "Помилка при відновленні з резервної копії" })
  }
}

export default authMiddleware(handler)

