import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function cacheMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Налаштування заголовків кешування
  const cacheControl = ["public", "max-age=3600", "stale-while-revalidate=86400"]

  // Додаємо заголовки кешування для статичних ресурсів
  if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    response.headers.set("Cache-Control", cacheControl.join(", "))
  }

  return response
}

