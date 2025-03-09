import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../../lib/prisma"
import { authMiddleware } from "../../../../../middleware/auth"
import { deleteBackup } from "../../../../../utils/backup"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Перевіряємо права адміністратора
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Недостатньо прав для видалення резервної копії",
      })
    }

    // Перевіряємо існування резервної копії
    const backup = await prisma.backup.findUnique({
      where: { id: id as string },
    })

    if (!backup) {
      return res.status(404).json({ error: "Резервну копію не знайдено" })
    }

    // Видаляємо файл та запис з бази даних
    await deleteBackup(backup)

    // Логуємо видалення
    await prisma.systemLog.create({
      data: {
        level: "info",
        category: "backup",
        message: "Видалено резервну копію",
        details: JSON.stringify({
          backupId: backup.id,
          filename: backup.filename,
        }),
        userId: req.user.id,
        ip: req.socket.remoteAddress,
      },
    })

    res.status(200).json({ message: "Резервну копію успішно видалено" })
  } catch (error) {
    console.error("Error deleting backup:", error)
    res.status(500).json({ error: "Помилка при видаленні резервної копії" })
  }
}

export default authMiddleware(handler)

