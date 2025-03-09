import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import formidable from "formidable"
import { createReadStream } from "fs"
import { createHash } from "crypto"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const form = formidable()
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const file = files.file
    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: "Файл не знайдено" })
    }

    // Читаємо та парсимо JSON файл
    const fileContent = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      createReadStream(file.filepath)
        .on("data", (chunk) => chunks.push(Buffer.from(chunk)))
        .on("error", (err) => reject(err))
        .on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    })

    const data = JSON.parse(fileContent)
    const results = {
      success: [] as string[],
      warnings: [] as string[],
      errors: [] as string[],
    }

    // Перевіряємо метадані
    if (!data._meta) {
      return res.status(400).json({
        error: "Недійсний формат файлу імпорту",
      })
    }

    // Починаємо транзакцію
    await prisma.$transaction(async (tx) => {
      let progress = 0
      const totalSteps = Object.keys(data).filter((k) => k !== "_meta").length

      // Імпорт налаштувань
      if (data.settings) {
        try {
          for (const setting of data.settings) {
            await tx.setting.upsert({
              where: { key: setting.key },
              update: {
                value: setting.value,
                type: setting.type,
                description: setting.description,
              },
              create: setting,
            })
          }
          results.success.push(`Імпортовано ${data.settings.length} налаштувань`)
        } catch (error) {
          results.errors.push("Помилка імпорту налаштувань")
        }
        progress += (1 / totalSteps) * 100
        res.write(JSON.stringify({ progress: Math.round(progress) }) + "\n")
      }

      // Імпорт користувачів
      if (data.users) {
        try {
          for (const user of data.users) {
            const existingUser = await tx.user.findUnique({
              where: { email: user.email },
            })

            if (existingUser) {
              await tx.user.update({
                where: { id: existingUser.id },
                data: {
                  name: user.name,
                  role: user.role,
                  status: user.status,
                  image: user.image,
                },
              })
              results.warnings.push(`Оновлено існуючого користувача: ${user.email}`)
            } else {
              await tx.user.create({
                data: {
                  ...user,
                  password: createHash("sha256").update(Math.random().toString()).digest("hex"),
                },
              })
            }
          }
          results.success.push(`Імпортовано ${data.users.length} користувачів`)
        } catch (error) {
          results.errors.push("Помилка імпорту користувачів")
        }
        progress += (1 / totalSteps) * 100
        res.write(JSON.stringify({ progress: Math.round(progress) }) + "\n")
      }

      // Імпорт статей
      if (data.articles) {
        try {
          for (const article of data.articles) {
            const { author, categories, tags, ...articleData } = article

            await tx.article.upsert({
              where: { id: article.id },
              update: {
                ...articleData,
                categories: {
                  connect: categories.map((c) => ({ id: c.id })),
                },
                tags: {
                  connect: tags.map((t) => ({ id: t.id })),
                },
              },
              create: {
                ...articleData,
                authorId: author.id,
                categories: {
                  connect: categories.map((c) => ({ id: c.id })),
                },
                tags: {
                  connect: tags.map((t) => ({ id: t.id })),
                },
              },
            })
          }
          results.success.push(`Імпортовано ${data.articles.length} статей`)
        } catch (error) {
          results.errors.push("Помилка імпорту статей")
        }
        progress += (1 / totalSteps) * 100
        res.write(JSON.stringify({ progress: Math.round(progress) }) + "\n")
      }

      // Імпорт коментарів
      if (data.comments) {
        try {
          for (const comment of data.comments) {
            const { user, article, ...commentData } = comment

            await tx.comment.upsert({
              where: { id: comment.id },
              update: commentData,
              create: {
                ...commentData,
                userId: user.id,
                articleId: article.id,
              },
            })
          }
          results.success.push(`Імпортовано ${data.comments.length} коментарів`)
        } catch (error) {
          results.errors.push("Помилка імпорту коментарів")
        }
        progress += (1 / totalSteps) * 100
        res.write(JSON.stringify({ progress: Math.round(progress) }) + "\n")
      }

      // Імпорт файлів
      if (data.files) {
        try {
          for (const file of data.files) {
            await tx.file.upsert({
              where: { id: file.id },
              update: file,
              create: file,
            })
          }
          results.success.push(`Імпортовано ${data.files.length} файлів`)
        } catch (error) {
          results.errors.push("Помилка імпорту файлів")
        }
        progress += (1 / totalSteps) * 100
        res.write(JSON.stringify({ progress: Math.round(progress) }) + "\n")
      }

      // Логуємо імпорт
      await tx.systemLog.create({
        data: {
          level: "info",
          category: "import",
          message: "Імпорт даних",
          details: JSON.stringify({
            meta: data._meta,
            results,
          }),
          userId: req.user.id,
          ip: req.socket.remoteAddress,
        },
      })
    })

    res.status(200).json(results)
  } catch (error) {
    console.error("Error importing data:", error)
    res.status(500).json({ error: "Помилка імпорту даних" })
  }
}

export default authMiddleware(handler)

