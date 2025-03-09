import type { NextApiRequest, NextApiResponse } from "next"
import { IncomingForm } from "formidable"
import { promises as fs } from "fs"
import path from "path"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"
import { getAudioDurationInSeconds } from "get-audio-duration"

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
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/uploads"),
      keepExtensions: true,
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err)
        return res.status(500).json({ error: "Помилка при завантаженні файлу" })
      }

      const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files]
      const results = []

      for (const file of uploadedFiles) {
        if (!file) continue

        try {
          const duration = await getAudioDurationInSeconds(file.filepath)
          const fileName = path.basename(file.filepath)
          const fileUrl = `/uploads/${fileName}`

          // Спроба отримати метадані з назви файлу
          const nameWithoutExt = path.parse(file.originalFilename || "").name
          const [artist, title] = nameWithoutExt.split(" - ")

          const track = await prisma.track.create({
            data: {
              title: title || nameWithoutExt,
              artist: artist || "Невідомий виконавець",
              album: "Невідомий альбом",
              genre: "Невідомий жанр",
              duration: Math.round(duration),
              fileUrl,
              playCount: 0,
            },
          })

          results.push(track)
        } catch (error) {
          console.error("Error processing file:", error)
          // Видаляємо файл у разі помилки
          await fs.unlink(file.filepath).catch(console.error)
        }
      }

      res.status(201).json({ tracks: results })
    })
  } catch (error) {
    console.error("Error handling upload:", error)
    res.status(500).json({ error: "Помилка при обробці завантаження" })
  }
}

export default authMiddleware(handler)

