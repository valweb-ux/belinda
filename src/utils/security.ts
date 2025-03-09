import { Redis } from "ioredis"
import { hash, compare } from "bcryptjs"

const redis = new Redis(process.env.REDIS_URL)

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function rateLimit(key: string, limit = 100, window = 60) {
  const current = await redis.incr(key)

  if (current === 1) {
    await redis.expire(key, window)
  }

  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
    reset: await redis.ttl(key),
  }
}

export function sanitizeHtml(html: string): string {
  // Використовуємо DOMPurify для очищення HTML
  const createDOMPurify = require("dompurify")
  const { JSDOM } = require("jsdom")
  const window = new JSDOM("").window
  const DOMPurify = createDOMPurify(window)

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "strong",
      "em",
      "u",
      "strike",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "a",
      "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title"],
  })
}

