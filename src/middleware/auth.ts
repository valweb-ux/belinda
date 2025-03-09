import type { NextApiRequest, NextApiResponse } from "next"
import { verify } from "jsonwebtoken"
import { prisma } from "../lib/prisma"

export interface AuthenticatedRequest extends NextApiRequest {
  user?: any
}

export function authMiddleware(handler: Function) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "")

      if (!token) {
        return res.status(401).json({ error: "Необхідна авторизація" })
      }

      const decoded = verify(token, process.env.JWT_SECRET!)
      const user = await prisma.user.findUnique({
        where: {
          id: (decoded as any).id,
        },
      })

      if (!user) {
        return res.status(401).json({ error: "Користувача не знайдено" })
      }

      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: "Недійсний токен" })
    }
  }
}

