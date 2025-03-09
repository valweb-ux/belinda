import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const news = await prisma.news.findMany({
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        })
        res.status(200).json(news)
      } catch (error) {
        res.status(500).json({ error: "Помилка при отриманні новин" })
      }
      break

    case "POST":
      try {
        const { title, content, image, tags, isPublished, showOnHomepage } = req.body
        const news = await prisma.news.create({
          data: {
            title,
            content,
            image,
            tags,
            isPublished,
            showOnHomepage,
            authorId: req.user.id,
          },
        })
        res.status(201).json(news)
      } catch (error) {
        res.status(500).json({ error: "Помилка при створенні новини" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

