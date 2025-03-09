import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/middleware/auth"
import { redis } from "@/lib/redis"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const settings = await prisma.securitySettings.findFirst()
        if (!settings) {
          return res.status(404).json({ error: "Налаштування безпеки не знайдено" })
        }
        res.status(200).json(settings)
      } catch (error) {
        console.error("Error fetching security settings:", error)
        res.status(500).json({ error: "Помилка при отриманні налаштувань безпеки" })
      }
      break

    case "PUT":
      try {
        const { twoFactorAuth, passwordPolicy, sessionTimeout, ipWhitelist, loginAttempts } = req.body

        // Validation
        if (sessionTimeout < 5) {
          return res.status(400).json({
            error: "Час очікування сесії не може бути менше 5 хвилин",
          })
        }

        if (passwordPolicy.minLength < 6) {
          return res.status(400).json({
            error: "Мінімальна довжина паролю не може бути менше 6 символів",
          })
        }

        // IP address validation
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        const invalidIps = ipWhitelist.filter((ip) => !ipRegex.test(ip))
        if (invalidIps.length > 0) {
          return res.status(400).json({
            error: `Некоректні IP-адреси: ${invalidIps.join(", ")}`,
          })
        }

        const settings = await prisma.securitySettings.upsert({
          where: { id: 1 },
          update: {
            twoFactorAuth,
            passwordPolicy,
            sessionTimeout,
            ipWhitelist,
            loginAttempts,
            updatedAt: new Date(),
          },
          create: {
            twoFactorAuth,
            passwordPolicy,
            sessionTimeout,
            ipWhitelist,
            loginAttempts,
          },
        })

        // Update security settings cache
        await redis.set("security_settings", JSON.stringify(settings))

        // Log settings change
        await prisma.adminLog.create({
          data: {
            action: "UPDATE_SECURITY_SETTINGS",
            adminId: (req as any).user.id,
            details: JSON.stringify({
              before: await prisma.securitySettings.findFirst(),
              after: settings,
            }),
          },
        })

        res.status(200).json(settings)
      } catch (error) {
        console.error("Error updating security settings:", error)
        res.status(500).json({ error: "Помилка при оновленні налаштувань безпеки" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "PUT"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

