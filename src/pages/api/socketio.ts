import { Server } from "socket.io"
import type { NextApiRequest } from "next"
import { prisma } from "../../../lib/prisma"

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected")

      // Отримання списку активних користувачів
      socket.on("getUsers", async () => {
        try {
          const users = await prisma.user.findMany({
            where: {
              status: "active",
            },
            select: {
              id: true,
              name: true,
              status: true,
              lastMessage: true,
              lastMessageTime: true,
            },
          })

          socket.emit("users", users)
        } catch (error) {
          console.error("Error fetching users:", error)
        }
      })

      // Обробка повідомлення від адміністратора
      socket.on("adminMessage", async (message) => {
        try {
          const savedMessage = await prisma.chatMessage.create({
            data: {
              fromUserId: "admin",
              toUserId: message.userId,
              content: message.content,
              timestamp: new Date(),
            },
          })

          // Оновлення останнього повідомлення користувача
          await prisma.user.update({
            where: { id: message.userId },
            data: {
              lastMessage: message.content,
              lastMessageTime: new Date(),
            },
          })

          // Відправка повідомлення конкретному користувачу
          socket.to(message.userId).emit("message", {
            id: savedMessage.id,
            userId: "admin",
            userName: "Адміністратор",
            content: message.content,
            timestamp: savedMessage.timestamp,
            isAdmin: true,
          })

          // Відправка підтвердження адміністратору
          socket.emit("messageSent", savedMessage)
        } catch (error) {
          console.error("Error saving message:", error)
          socket.emit("messageError", { error: "Помилка при відправці повідомлення" })
        }
      })

      // Обробка відключення
      socket.on("disconnect", () => {
        console.log("Client disconnected")
      })
    })
  }

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default ioHandler

