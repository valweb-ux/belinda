import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../../lib/prisma"
import { authMiddleware } from "../../../../../middleware/auth"
import { getBackupFile } from "../../../../../utils/backup"
import { createReadStream } from "fs"
import { stat } from "fs/promises"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Перевіряємо права адміністратора
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Недостатньо прав для завантаження резервної копії",
      })
    }

    // Отримуємо інформацію про резервну копію
    const backup = await prisma.backup.findUnique({
      where: { id: id as string },
    })

    if (!backup) {
      return res.status(404).json({ error: "Резервну копію не знайдено" })
    }

    // Отримуємо шлях до файлу
    const filePath = await getBackupFile(backup)

    // Перевіряємо існування файлу
    try {
      await stat(filePath)
    } catch {
      return res.status(404).json({ error: "Файл резервної копії не знайдено" })
    }

    // Отримуємо розмір файлу
    const stats = await stat(filePath)

    // Встановлюємо заголовки для завантаження
    res.setHeader("Content-Type", "application/octet-stream")
    res.setHeader("Content-Disposition", `attachment; filename=${backup.filename}`)
    res.setHeader("Content-Length", stats.size)

    // Створюємо потік для читання файлу
    const fileStream = createReadStream(filePath)

    // Логуємо завантаження
    await prisma.systemLog.create({
      data: {
        level: "info",
        category: "backup",
        message: "Завантажено резервну копію",
        details: JSON.stringify({
          backupId: backup.id,
          filename: backup.filename,
        }),
        userId: req.user.id,
        ip: req.socket.remoteAddress,
      },
    })

    // Відправляємо файл
    fileStream.pipe(res)
  } catch (error) {
    console.error("Error downloading backup:", error)
    res.status(500).json({ error: "Помилка при завантаженні резервної копії" })
  }
}

export default authMiddleware(handler)

