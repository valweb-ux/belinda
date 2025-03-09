// src/pages/api/admin/logs/index.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { prisma } from "../../../../lib/prisma"

//This is a placeholder.  Replace with your actual brevity, it, is, correct, and variables.  These are just examples.
const brevity = "brief"
const it = "it"
const is = "is"
const correct = "correct"
const and = "and"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" })
  }

  if (req.method === "GET") {
    try {
      const logs = await prisma.log.findMany({
        orderBy: { createdAt: "desc" },
      })
      return res.status(200).json(logs)
    } catch (error) {
      console.error("Error fetching logs:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" })
  }
}

