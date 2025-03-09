import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const { type = "all", status = "all", search = "" } = req.query

        const where = {
          AND: [
            type !== "all" ? { type: String(type) } : {},
            status !== "all" ? { status: String(status) } : {},
            search
              ? {
                  OR: [
                    { title: { contains: String(search), mode: "insensitive" } },
                    { message: { contains: String(search), mode: "insensitive" } },
                  ],
                }
              : {},
          ],
        }

        const notifications = await prisma.notification.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            targetUsers: {
              select: {
                userId: true,
              },
            },
          },
        })

        const formattedNotifications = notifications.map((notification) => ({
          ...notification,
          targetUsers: notification.targetUsers.map((tu) => tu.userId),
        }))

        res.status(200).json(formattedNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        res.status(500).json({ error: "Помилка при отриманні сповіщень" })
      }
      break

    case "POST":
      try {
        const { title, message, type, target, targetUsers = [], scheduledFor } = req.body

        // Валідація
        if (!title || !message || !type || !target) {
          return res.status(400).json({
            error: "Всі обов'язкові поля повинні бути заповнені",
          })
        }

        // Створення сповіщення
        const notification = await prisma.notification.create({
          data: {
            title,
            message,
            type,
            target,
            status: scheduledFor ? "scheduled" : "draft",
            scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
            createdBy: req.user.id,
            targetUsers:
              target === "specific"
                ? {
                    create: targetUsers.map((userId) => ({
                      userId,
                    })),
                  }
                : undefined,
          },
        })

        // Якщо сповіщення заплановане, створюємо завдання для відправки
        if (scheduledFor) {
          await prisma.scheduledTask.create({
            data: {
              type: "SEND_NOTIFICATION",
              scheduledFor: new Date(scheduledFor),
              data: {
                notificationId: notification.id,
              },
            },
          })
        }

        res.status(201).json(notification)
      } catch (error) {
        console.error("Error creating notification:", error)
        res.status(500).json({ error: "Помилка при створенні сповіщення" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

