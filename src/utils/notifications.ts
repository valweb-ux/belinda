import { prisma } from "../lib/prisma"

export type NotificationType = "info" | "success" | "warning" | "error"

interface CreateNotificationOptions {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
}

export async function createNotification(options: CreateNotificationOptions) {
  const { userId, type, title, message, data } = options

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
      },
    })

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

export async function createSystemNotification(
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, any>,
) {
  try {
    // Отримуємо всіх адміністраторів
    const admins = await prisma.user.findMany({
      where: {
        role: "admin",
      },
    })

    // Створюємо сповіщення для кожного адміністратора
    await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: admin.id,
          type,
          title,
          message,
          data,
        }),
      ),
    )
  } catch (error) {
    console.error("Error creating system notification:", error)
  }
}

export async function getUnreadNotificationsCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    })

    return count
  } catch (error) {
    console.error("Error getting unread notifications count:", error)
    return 0
  }
}

export async function cleanOldNotifications(daysToKeep = 30) {
  try {
    const date = new Date()
    date.setDate(date.getDate() - daysToKeep)

    await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
        read: true,
      },
    })
  } catch (error) {
    console.error("Error cleaning old notifications:", error)
  }
}

