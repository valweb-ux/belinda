import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import { validatePassword } from "../../../../utils/validation"
import { compare, hash } from "bcryptjs"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { currentPassword, newPassword } = req.body

    // Валідація
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Поточний і новий паролі обов'язкові",
      })
    }

    // Отримуємо налаштування безпеки
    const settings = await prisma.systemSettings.findFirst()
    if (!settings) {
      return res.status(500).json({
        error: "Помилка отримання налаштувань системи",
      })
    }

    // Валідуємо новий пароль
    const validationError = validatePassword(newPassword, settings.data.security.passwordPolicy)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    // Отримуємо користувача з паролем
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { password: true },
    })

    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" })
    }

    // Перевіряємо поточний пароль
    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      return res.status(400).json({ error: "Невірний поточний пароль" })
    }

    // Хешуємо новий пароль
    const hashedPassword = await hash(newPassword, 12)

    // Оновлюємо пароль
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    })

    // Логуємо зміну пароля
    await prisma.systemLog.create({
      data: {
        level: "warning",
        category: "security",
        message: "Пароль користувача змінено",
        details: JSON.stringify({
          userId: req.user.id,
          timestamp: new Date().toISOString(),
        }),
        userId: req.user.id,
        ip: req.socket.remoteAddress,
      },
    })

    res.status(200).json({ message: "Пароль успішно змінено" })
  } catch (error) {
    console.error("Error changing password:", error)
    res.status(500).json({ error: "Помилка зміни пароля" })
  }
}

export default authMiddleware(handler)

