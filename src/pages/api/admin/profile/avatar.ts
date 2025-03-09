import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import { deleteFile } from "../../../../utils/storage"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Отримуємо користувача
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { image: true },
    })

    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" })
    }

    // Якщо є аватар - видаляємо його
    if (user.image) {
      await deleteFile(user.image)
    }

    // Оновлюємо користувача
    await prisma.user.update({
      where: { id: req.user.id },
      data: { image: null },
    })

    // Логуємо видалення аватара
    await prisma.systemLog.create({
      data: {
        level: "info",
        category: "profile",
        message: "Аватар користувача видалено",
        details: JSON.stringify({
          userId: req.user.id,
          previousImage: user.image,
        }),
        userId: req.user.id,
        ip: req.socket.remoteAddress,
      },
    })

    res.status(200).json({ message: "Аватар успішно видалено" })
  } catch (error) {
    console.error("Error deleting avatar:", error)
    res.status(500).json({ error: "Помилка видалення аватара" })
  }
}

export default authMiddleware(handler)

