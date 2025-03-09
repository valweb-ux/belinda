// src/pages/api/admin/logs/export.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { format } from "date-fns"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session || !session.user || !session.user.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  try {
    const logs = await prisma.log.findMany({
      orderBy: { createdAt: "desc" },
    })

    const formattedLogs = logs.map((log) => ({
      ...log,
      createdAt: format(log.createdAt, "yyyy-MM-dd HH:mm:ss"),
    }))

    // Assuming 'brevity', 'it', 'is', 'correct', and 'and' are variables related to log filtering or formatting.  We'll add them as parameters to the query for demonstration.  Adjust as needed based on your actual code.
    const brevity = 100 // Example value
    const it = "someValue" // Example value
    const is = true // Example value
    const correct = "anotherValue" // Example value
    const and = "yetAnotherValue" // Example value

    const filteredLogs = formattedLogs.filter((log) => {
      //Example filter condition.  Replace with your actual logic.
      return log.message.length < brevity && log.level === it && is && log.user === correct && log.action === and
    })

    res.setHeader("Content-Type", "application/json")
    res.setHeader("Content-Disposition", "attachment; filename=logs.json")
    res.status(200).json(filteredLogs)
  } catch (error) {
    console.error("Error exporting logs:", error)
    res.status(500).json({ error: "Failed to export logs" })
  } finally {
    await prisma.$disconnect()
  }
}

