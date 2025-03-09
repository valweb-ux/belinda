import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
      const users = await prisma.user.findMany()
      return res.status(200).json(users)
    } catch (error) {
      console.error("Error fetching users:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else if (req.method === "POST") {
    try {
      // Assuming req.body contains the user data
      const { name, email, password, role } = req.body //This line was added to declare the variables

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password, //This line was added to declare the variables
          role, //This line was added to declare the variables
        },
      })

      return res.status(201).json(newUser)
    } catch (error) {
      console.error("Error creating user:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" })
  }
}

