import os from "os"
import { exec } from "child_process"
import { promisify } from "util"
import { prisma } from "../lib/prisma"

const execAsync = promisify(exec)

interface SystemMetrics {
  timestamp: string
  cpu: number
  memory: number
  disk: number
}

export async function getSystemMetrics(): Promise<SystemMetrics[]> {
  try {
    // Отримуємо метрики за останню годину
    const metrics = await prisma.systemMetric.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return metrics.map((metric) => ({
      timestamp: metric.createdAt.toISOString(),
      cpu: Number.parseFloat(metric.cpu.toFixed(2)),
      memory: Number.parseFloat(metric.memory.toFixed(2)),
      disk: Number.parseFloat(metric.disk.toFixed(2)),
    }))
  } catch (error) {
    console.error("Error getting system metrics:", error)
    return []
  }
}

export async function collectSystemMetrics(): Promise<void> {
  try {
    // CPU використання
    const cpuUsage = await getCpuUsage()

    // Пам'ять
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100

    // Диск
    const diskUsage = await getDiskUsage()

    // Зберігаємо метрики
    await prisma.systemMetric.create({
      data: {
        cpu: cpuUsage,
        memory: memoryUsage,
        disk: diskUsage,
      },
    })

    // Видаляємо старі метрики (старші 24 годин)
    await prisma.systemMetric.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })
  } catch (error) {
    console.error("Error collecting system metrics:", error)
  }
}

async function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startMeasure = os.cpus().map((cpu) => ({
      idle: cpu.times.idle,
      total: Object.values(cpu.times).reduce((acc, time) => acc + time, 0),
    }))

    setTimeout(() => {
      const endMeasure = os.cpus().map((cpu) => ({
        idle: cpu.times.idle,
        total: Object.values(cpu.times).reduce((acc, time) => acc + time, 0),
      }))

      const cpuUsage = startMeasure.map((start, i) => {
        const end = endMeasure[i]
        const idle = end.idle - start.idle
        const total = end.total - start.total
        return (1 - idle / total) * 100
      })

      resolve(cpuUsage.reduce((acc, usage) => acc + usage, 0) / cpuUsage.length)
    }, 100)
  })
}

async function getDiskUsage(): Promise<number> {
  try {
    if (process.platform === "win32") {
      const { stdout } = await execAsync("wmic logicaldisk get size,freespace,caption")
      const lines = stdout.trim().split("\n").slice(1)
      let totalSize = 0
      let totalFree = 0

      lines.forEach((line) => {
        const [caption, freeSpace, size] = line.trim().split(/\s+/)
        if (caption && freeSpace && size) {
          totalSize += Number.parseInt(size)
          totalFree += Number.parseInt(freeSpace)
        }
      })

      return ((totalSize - totalFree) / totalSize) * 100
    } else {
      const { stdout } = await execAsync("df -k / | tail -1")
      const [, total, used] = stdout.trim().split(/\s+/)
      return (Number.parseInt(used) / Number.parseInt(total)) * 100
    }
  } catch (error) {
    console.error("Error getting disk usage:", error)
    return 0
  }
}

export function startMetricsCollection(interval = 60000): void {
  // Збираємо метрики кожну хвилину
  setInterval(collectSystemMetrics, interval)
}

export async function getSystemInfo(): Promise<{
  os: string
  platform: string
  arch: string
  cpus: number
  totalMemory: string
  uptime: string
}> {
  const totalMemory = os.totalmem()
  const uptime = os.uptime()

  return {
    os: os.type(),
    platform: process.platform,
    arch: process.arch,
    cpus: os.cpus().length,
    totalMemory: formatBytes(totalMemory),
    uptime: formatUptime(uptime),
  }
}

function formatBytes(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)

  return parts.join(" ")
}

