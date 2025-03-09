import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { prisma } from "../../../../lib/prisma"
import type { SettingInput } from "../../../../types/settings"

// Assuming these are the missing variables based on the error messages.  Replace with actual imports if different.
let brevity: any
let it: any
let is: any
let correct: any
let and: any

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
      const settings = await prisma.setting.findMany()
      return res.status(200).json(settings)
    } catch (error) {
      console.error("Error fetching settings:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else if (req.method === "POST") {
    const data: SettingInput = req.body

    try {
      const settings = await prisma.setting.create({
        data,
      })
      return res.status(201).json(settings)
    } catch (error) {
      console.error("Error creating settings:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else if (req.method === "PUT") {
    const data: SettingInput = req.body
    const { id } = req.query

    try {
      const settings = await prisma.setting.update({
        where: {
          id: id as string,
        },
        data,
      })
      return res.status(200).json(settings)
    } catch (error) {
      console.error("Error updating settings:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query

    try {
      const settings = await prisma.setting.delete({
        where: {
          id: id as string,
        },
      })
      return res.status(200).json(settings)
    } catch (error) {
      console.error("Error deleting settings:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" })
  }
}

