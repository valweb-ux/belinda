"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material"
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import EmojiPicker from "emoji-picker-react"
import styles from "./Chat.module.scss"

interface Message {
  id: string
  content: string
  userId: string
  createdAt: string
  updatedAt: string
  attachments: Array<{
    id: string
    name: string
    url: string
    type: string
  }>
  user: {
    name: string
    email: string
    image: string | null
  }
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [showEmoji, setShowEmoji] = useState(false)
  const [editMessage, setEditMessage] = useState<Message | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    message: Message
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 10000) // Оновлюємо кожні 10 секунд
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, []) //Fixed: Removed unnecessary dependency 'messages'

  const fetchMessages = async () => {
    try {
      setError(null)
      const response = await fetch("/api/admin/chat")
      if (!response.ok) throw new Error("Помилка завантаження повідомлень")

      const data = await response.json()
      setMessages(data.messages)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setError("Не вдалося завантажити повідомлення")
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!message.trim() && !attachments.length) return

    try {
      const formData = new FormData()
      formData.append("content", message)
      attachments.forEach((file) => {
        formData.append("attachments", file)
      })

      const response = await fetch("/api/admin/chat", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Помилка надсилання повідомлення")

      setMessage("")
      setAttachments([])
      fetchMessages()
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Помилка надсилання повідомлення")
    }
  }

  const handleEdit = async () => {
    if (!editMessage || !message.trim()) return

    try {
      const response = await fetch(`/api/admin/chat/${editMessage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      })

      if (!response.ok) throw new Error("Помилка редагування повідомлення")

      setMessage("")
      setEditMessage(null)
      fetchMessages()
    } catch (error) {
      console.error("Error editing message:", error)
      setError("Помилка редагування повідомлення")
    }
  }

  const handleDelete = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/chat/${messageId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Помилка видалення повідомлення")

      fetchMessages()
    } catch (error) {
      console.error("Error deleting message:", error)
      setError("Помилка видалення повідомлення")
    }
  }

  return (
    <div className={styles.chat}>
      <Card>
        <CardContent>
          <Typography variant="h2" className={styles.title}>
            Чат
          </Typography>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          <div className={styles.messages}>
            {loading ? (
              <div className={styles.loading}>
                <CircularProgress />
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={styles.message}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({
                      mouseX: e.clientX,
                      mouseY: e.clientY,
                      message,
                    })
                  }}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={message.user.image || undefined}>{message.user.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <div className={styles.messageHeader}>
                          <Typography component="span" variant="subtitle2">
                            {message.user.name}
                          </Typography>
                          <Typography component="span" variant="caption" color="textSecondary">
                            {format(new Date(message.createdAt), "dd.MM.yyyy HH:mm", { locale: uk })}
                          </Typography>
                        </div>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" className={styles.messageContent}>
                            {message.content}
                          </Typography>
                          {message.attachments.length > 0 && (
                            <div className={styles.attachments}>
                              {message.attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.attachment}
                                >
                                  {attachment.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.input}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введіть повідомлення..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  editMessage ? handleEdit() : handleSend()
                }
              }}
            />
            <div className={styles.actions}>
              <IconButton onClick={() => fileInputRef.current?.click()} disabled={!!editMessage}>
                <AttachFileIcon />
              </IconButton>
              <IconButton onClick={() => setShowEmoji(!showEmoji)}>
                <EmojiIcon />
              </IconButton>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={editMessage ? handleEdit : handleSend}
                disabled={!message.trim() && !attachments.length}
              >
                {editMessage ? "Зберегти" : "Надіслати"}
              </Button>
            </div>
          </div>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              setAttachments((prev) => [...prev, ...files])
            }}
          />
        </CardContent>
      </Card>

      {/* Контекстне меню */}
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem
          onClick={() => {
            if (contextMenu) {
              setMessage(contextMenu.message.content)
              setEditMessage(contextMenu.message)
              setContextMenu(null)
            }
          }}
        >
          <EditIcon fontSize="small" className={styles.menuIcon} />
          Редагувати
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu) {
              handleDelete(contextMenu.message.id)
              setContextMenu(null)
            }
          }}
          className={styles.deleteMenuItem}
        >
          <DeleteIcon fontSize="small" className={styles.menuIcon} />
          Видалити
        </MenuItem>
      </Menu>

      {/* Емодзі пікер */}
      {showEmoji && (
        <div className={styles.emojiPicker}>
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setMessage((prev) => prev + emoji.emoji)
              setShowEmoji(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

