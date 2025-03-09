import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import { uploadFile } from "../../../../utils/storage"
import formidable from "formidable"
import { createReadStream } from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        // Отримуємо повідомлення
        const messages = await prisma.chatMessage.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
            attachments: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 100, // Обмежуємо кількість повідомлень
        })

        res.status(200).json({ messages })
      } catch (error) {
        console.error("Error fetching messages:", error)
        res.status(500).json({ error: "Помилка отримання повідомлень" })
      }
      break

    case "POST":
      try {
        const form = formidable({
          maxFileSize: 10 * 1024 * 1024, // 10MB
        })

        const [fields, files] = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err)
            resolve([fields, files])
          })
        })

        const content = fields.content?.[0]
        if (!content?.trim() && !files.attachments) {
          return res.status(400).json({ error: "Повідомлення не може бути порожнім" })
        }

        // Створюємо повідомлення
        const message = await prisma.chatMessage.create({
          data: {
            content: content || "",
            userId: req.user.id,
          },
        })

        // Завантажуємо вкладення
        if (files.attachments) {
          const attachments = Array.isArray(files.attachments) ? files.attachments : [files.attachments]

          await Promise.all(
            attachments.map(async (file) => {
              const stream = createReadStream(file.filepath)
              const { url } = await uploadFile(stream, {
                filename: file.originalFilename || file.newFilename,
                contentType: file.mimetype || "application/octet-stream",
                folder: `/chat/${message.id}`,
              })

              await prisma.chatAttachment.create({
                data: {
                  messageId: message.id,
                  name: file.originalFilename || file.newFilename,
                  url,
                  type: file.mimetype || "application/octet-stream",
                },
              })
            }),
          )
        }

        // Отримуємо повне повідомлення з вкладеннями
        const fullMessage = await prisma.chatMessage.findUnique({
          where: { id: message.id },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
            attachments: true,
          },
        })

        res.status(201).json(fullMessage)
      } catch (error) {
        console.error("Error creating message:", error)
        res.status(500).json({ error: "Помилка створення повідомлення" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

