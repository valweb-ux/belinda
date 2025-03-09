// src/pages/api/admin/files/index.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
      const { file } = req.body

      if (!file) {
        return res.status(400).json({ message: "No file provided" })
      }

      const { createReadStream, filename, mimetype } = await file

      const uploadResult = await cloudinary.uploader.upload_stream(createReadStream, {
        resource_type: "auto",
        public_id: filename,
        type: mimetype,
      })

      const newFile = await prisma.file.create({
        data: {
          url: uploadResult.secure_url,
          filename: filename,
          mimetype: mimetype,
        },
      })

      return res.status(201).json(newFile)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else if (req.method === "GET") {
    try {
      const files = await prisma.file.findMany()
      return res.status(200).json(files)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" })
  }
}

