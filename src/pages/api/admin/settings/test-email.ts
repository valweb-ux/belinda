// src/pages/api/admin/settings/test-email.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { sendTestEmail } from "../../../../lib/email"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (!session.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden" })
  }

  try {
    const { email, brevity, it, is, correct, and } = req.body //Declare variables here

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    await sendTestEmail(email, brevity, it, is, correct, and) //Pass variables to the function

    return res.status(200).json({ message: "Test email sent successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to send test email" })
  }
}

