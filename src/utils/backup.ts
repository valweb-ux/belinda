import type { Backup } from "@prisma/client"
import { prisma } from "../lib/prisma"
import { exec } from "child_process"
import { promisify } from "util"
import { createWriteStream, mkdir, unlink, stat } from "fs"
import { join } from "path"
import archiver from "archiver"
import extract from "extract-zip"
import { format } from "date-fns"

const execAsync = promisify(exec)
const BACKUP_DIR = process.env.BACKUP_DIR || "backups"

interface CreateBackupOptions {
  type: "manual" | "auto"
  userId: string
}

export async function createBackup(options: CreateBackupOptions): Promise<Backup> {
  // Створюємо директорію для резервних копій, якщо вона не існує
  await mkdir(BACKUP_DIR, { recursive: true })

  // Генеруємо ім'я файлу
  const timestamp = format(new Date(), "yyyyMMdd-HHmmss")
  const filename = `backup-${timestamp}.zip`
  const filePath = join(BACKUP_DIR, filename)

  try {
    // Створюємо запис про резервну копію
    const backup = await prisma.backup.create({
      data: {
        filename,
        type: options.type,
        status: "in_progress",
        createdBy: options.userId,
      },
    })

    // Створюємо архів
    const output = createWriteStream(filePath)
    const archive = archiver("zip", {
      zlib: { level: 9 },
    })

    archive.pipe(output)

    // Додаємо дані з бази даних
    const dumpFile = join(BACKUP_DIR, `${timestamp}-dump.sql`)
    await execAsync(`pg_dump ${process.env.DATABASE_URL} > ${dumpFile}`)
    archive.file(dumpFile, { name: "database.sql" })

    // Додаємо файли
    archive.directory("uploads", "uploads")
    archive.directory("public", "public")

    // Додаємо конфігурацію
    const config = {
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION,
      environment: process.env.NODE_ENV,
    }
    archive.append(JSON.stringify(config, null, 2), { name: "backup-info.json" })

    await archive.finalize()

    // Видаляємо тимчасовий файл дампу
    await unlink(dumpFile)

    // Оновлюємо розмір та статус
    const stats = await stat(filePath)
    await prisma.backup.update({
      where: { id: backup.id },
      data: {
        size: stats.size,
        status: "completed",
        completedAt: new Date(),
      },
    })

    return backup
  } catch (error) {
    // У разі помилки оновлюємо статус
    await prisma.backup.update({
      where: { id: backup.id },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : String(error), // Handle non-Error objects
        completedAt: new Date(),
      },
    })

    throw error
  }
}

export async function restoreFromBackup(backup: Backup): Promise<void> {
  const backupPath = join(BACKUP_DIR, backup.filename)
  const extractPath = join(BACKUP_DIR, `restore-${Date.now()}`)

  try {
    // Розпаковуємо архів
    await extract(backupPath, { dir: extractPath })

    // Відновлюємо базу даних
    const dumpFile = join(extractPath, "database.sql")
    await execAsync(`psql ${process.env.DATABASE_URL} < ${dumpFile}`)

    // Відновлюємо файли
    await execAsync(`rm -rf uploads/* && cp -r ${join(extractPath, "uploads")}/* uploads/`)
    await execAsync(`rm -rf public/* && cp -r ${join(extractPath, "public")}/* public/`)

    // Очищаємо тимчасову директорію
    await execAsync(`rm -rf ${extractPath}`)
  } catch (error) {
    // Очищаємо тимчасову директорію у разі помилки
    await execAsync(`rm -rf ${extractPath}`)
    throw error
  }
}

export async function deleteBackup(backup: Backup): Promise<void> {
  const filePath = join(BACKUP_DIR, backup.filename)

  try {
    // Видаляємо файл
    await unlink(filePath)

    // Видаляємо запис з бази даних
    await prisma.backup.delete({
      where: { id: backup.id },
    })
  } catch (error) {
    console.error("Error deleting backup:", error)
    throw error
  }
}

export async function getBackupFile(backup: Backup): Promise<string> {
  return join(BACKUP_DIR, backup.filename)
}

// Функція для автоматичного створення резервних копій
export async function scheduleBackups(): Promise<void> {
  const schedule = require("node-schedule")

  // Щоденне резервне копіювання о 3:00
  schedule.scheduleJob("0 3 * * *", async () => {
    try {
      // Отримуємо системного користувача
      const systemUser = await prisma.user.findFirst({
        where: { role: "system" },
      })

      if (!systemUser) {
        throw new Error("System user not found")
      }

      await createBackup({
        type: "auto",
        userId: systemUser.id,
      })

      // Видаляємо старі автоматичні копії (старші 30 днів)
      const oldBackups = await prisma.backup.findMany({
        where: {
          type: "auto",
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      })

      for (const backup of oldBackups) {
        await deleteBackup(backup)
      }
    } catch (error) {
      console.error("Error in scheduled backup:", error)
    }
  })
}

