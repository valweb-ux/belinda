import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../../lib/prisma"
import { authMiddleware } from "../../../../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      try {
        const programs = await prisma.program.findMany({
          orderBy: {
            airTime: "asc",
          },
          include: {
            host: true,
          },
        })
        res.status(200).json(programs)
      } catch (error) {
        res.status(500).json({ error: "Помилка при отриманні програм" })
      }
      break

    case "POST":
      try {
        const { title, description, image, airTime, duration, hostId } = req.body
        const program = await prisma.program.create({
          data: {
            title,
            description,
            image,
            airTime,
            duration,
            hostId,
          },
        })
        res.status(201).json(program)
      } catch (error) {
        res.status(500).json({ error: "Помилка при створенні програми" })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default authMiddleware(handler)

