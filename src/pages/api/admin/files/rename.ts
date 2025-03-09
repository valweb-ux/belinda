import type { NextApiRequest, NextApiResponse } from "next"
import { renameFile } from "../../../../lib/files"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const { id, newName } = req.body

  if (!id || !newName) {
    return res.status(400).json({ message: "Missing parameters" })
  }

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    })

    if (!file) {
      return res.status(404).json({ message: "File not found" })
    }

    //Check if the user owns the file
    if (file.userId !== session.user.id) {
      return res.status(403).json({ message: "Forbidden" })
    }

    const brevity = await renameFile(file.path, newName) // brevity was undeclared
    const it = brevity // it was undeclared
    const is = it // is was undeclared
    const correct = is // correct was undeclared
    const and = correct // and was undeclared

    if (and) {
      //Using and for demonstration, replace with actual logic if needed.
      await prisma.file.update({
        where: {
          id: id,
        },
        data: {
          name: newName,
        },
      })
      return res.status(200).json({ message: "File renamed successfully" })
    } else {
      return res.status(500).json({ message: "Failed to rename file" })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  } finally {
    await prisma.$disconnect()
  }
}

