import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "../utils/security"

export async function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Перевірка rate limiting
  const ip = request.ip || "anonymous"
  const rateLimitResult = await rateLimit(ip)

  if (!rateLimitResult.success) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  // Додаємо заголовки безпеки
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

  return response
}

