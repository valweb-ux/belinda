import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { q: query, type = "all" } = req.query

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Пошуковий запит обов'язковий" })
  }

  try {
    const results = []
    const searchQuery = query.toLowerCase()

    // Пошук користувачів
    if (type === "all" || type === "user") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        take: 10,
      })

      results.push(
        ...users.map((user) => ({
          id: user.id,
          type: "user",
          title: user.name,
          description: user.email,
          url: `/admin/users/${user.id}`,
          createdAt: user.createdAt,
          data: {
            role: user.role,
            status: user.status,
          },
        })),
      )
    }

    // Пошук статей
    if (type === "all" || type === "article") {
      const articles = await prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { content: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        take: 10,
      })

      results.push(
        ...articles.map((article) => ({
          id: article.id,
          type: "article",
          title: article.title,
          description: article.content.substring(0, 200) + "...",
          url: `/admin/articles/${article.id}`,
          createdAt: article.createdAt,
          data: {
            status: article.status,
            author: article.authorId,
          },
        })),
      )
    }

    // Пошук коментарів
    if (type === "all" || type === "comment") {
      const comments = await prisma.comment.findMany({
        where: {
          content: { contains: searchQuery, mode: "insensitive" },
        },
        include: {
          user: true,
          article: true,
        },
        take: 10,
      })

      results.push(
        ...comments.map((comment) => ({
          id: comment.id,
          type: "comment",
          title: `Коментар від ${comment.user.name}`,
          description: comment.content,
          url: `/admin/articles/${comment.articleId}#comment-${comment.id}`,
          createdAt: comment.createdAt,
          data: {
            author: comment.userId,
            article: comment.article.title,
          },
        })),
      )
    }

    // Пошук файлів
    if (type === "all" || type === "file") {
      const files = await prisma.file.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { path: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        take: 10,
      })

      results.push(
        ...files.map((file) => ({
          id: file.id,
          type: "file",
          title: file.name,
          description: file.path,
          url: file.url,
          createdAt: file.createdAt,
          data: {
            size: file.size,
            type: file.type,
          },
        })),
      )
    }

    // Пошук налаштувань
    if (type === "all" || type === "setting") {
      const settings = await prisma.setting.findMany({
        where: {
          OR: [
            { key: { contains: searchQuery, mode: "insensitive" } },
            { value: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        take: 10,
      })

      results.push(
        ...settings.map((setting) => ({
          id: setting.id,
          type: "setting",
          title: setting.key,
          description: setting.description || setting.value,
          createdAt: setting.updatedAt,
          data: {
            value: setting.value,
            type: setting.type,
          },
        })),
      )
    }

    // Пошук логів
    if (type === "all" || type === "log") {
      const logs = await prisma.systemLog.findMany({
        where: {
          OR: [
            { message: { contains: searchQuery, mode: "insensitive" } },
            { details: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        include: {
          user: true,
        },
        take: 10,
      })

      results.push(
        ...logs.map((log) => ({
          id: log.id,
          type: "log",
          title: log.message,
          description: log.details,
          createdAt: log.createdAt,
          data: {
            level: log.level,
            category: log.category,
            user: log.user?.name,
          },
        })),
      )
    }

    // Сортуємо результати за датою
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    res.status(200).json({ results })
  } catch (error) {
    console.error("Error performing search:", error)
    res.status(500).json({ error: "Помилка виконання пошуку" })
  }
}

export default authMiddleware(handler)

