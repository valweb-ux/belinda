import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../../lib/prisma"
import { authMiddleware } from "../../../../../middleware/auth"
import { restoreFromBackup } from "../../../../../utils/backup"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Перевіряємо права адміністратора
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Недостатньо прав для відновлення з резервної копії",
      })
    }

    // Отримуємо інформацію про резервну копію
    const backup = await prisma.backup.findUnique({
      where: { id: id as string },
    })

    if (!backup) {
      return res.status(404).json({ error: "Резервну копію не знайдено" })
    }

    if (backup.status !== "completed") {
      return res.status(400).json({
        error: "Неможливо відновити з пошкодженої резервної копії",
      })
    }

    // Створюємо запис про процес відновлення
    const restore = await prisma.systemRestore.create({
      data: {
        backupId: backup.id,
        status: "in_progress",
        startedBy: req.user.id,
      },
    })

    // Логуємо початок відновлення
    await prisma.systemLog.create({
      data: {
        level: "warning",
        category: "backup",
        message: "Початок відновлення системи",
        details: JSON.stringify({
          backupId: backup.id,
          restoreId: restore.id,
        }),
        userId: req.user.id,
        ip: req.socket.remoteAddress,
      },
    })

    try {
      // Виконуємо відновлення
      await restoreFromBackup(backup)

      // Оновлюємо статус відновлення
      await prisma.systemRestore.update({
        where: { id: restore.id },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      })

      // Логуємо успішне відновлення
      await prisma.systemLog.create({
        data: {
          level: "info",
          category: "backup",
          message: "Система успішно відновлена",
          details: JSON.stringify({
            backupId: backup.id,
            restoreId: restore.id,
          }),
          userId: req.user.id,
          ip: req.socket.remoteAddress,
        },
      })

      res.status(200).json({
        message: "Систему успішно відновлено з резервної копії",
      })
    } catch (error) {
      // Оновлюємо статус відновлення у разі помилки
      await prisma.systemRestore.update({
        where: { id: restore.id },
        data: {
          status: "failed",
          error: error.message,
          completedAt: new Date(),
        },
      })

      // Логуємо помилку відновлення
      await prisma.systemLog.create({
        data: {
          level: "error",
          category: "backup",
          message: "Помилка відновлення системи",
          details: JSON.stringify({
            backupId: backup.id,
            restoreId: restore.id,
            error: error.message,
          }),
          userId: req.user.id,
          ip: req.socket.remoteAddress,
        },
      })

      throw error
    }
  } catch (error) {
    console.error("Error restoring from backup:", error)
    res.status(500).json({
      error: "Помилка при відновленні системи з резервної копії",
    })
  }
}

export default authMiddleware(handler)

