import type { NextApiRequest, NextApiResponse } from "next"
import { IncomingForm } from "formidable"
import path from "path"
import { authMiddleware } from "../../../../middleware/auth"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public/uploads"),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err)
        return res.status(500).json({ error: "Помилка при завантаженні файлу" })
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      if (!file) {
        return res.status(400).json({ error: "Файл не знайдено" })
      }

      const fileName = file.newFilename
      const filePath = `/uploads/${fileName}`

      res.status(200).json({ url: filePath })
    })
  } catch (error) {
    console.error("Error handling file upload:", error)
    res.status(500).json({ error: "Помилка при завантаженні файлу" })
  }
}

export default authMiddleware(handler)

