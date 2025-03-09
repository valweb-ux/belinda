// src/pages/api/admin/files/folder.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" })
  }

  if (req.method === "POST") {
    try {
      const { name, parentId } = req.body

      //Check if name and parentId are provided
      if (!name || !parentId) {
        return res.status(400).json({ message: "Name and parentId are required" })
      }

      const newFolder = await prisma.folder.create({
        data: {
          id: uuidv4(),
          name: name,
          parentId: parentId,
        },
      })

      return res.status(201).json(newFolder)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" })
  }
}

