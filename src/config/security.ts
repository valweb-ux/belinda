import type { NextConfig } from "next"
import { ALLOWED_DOMAINS } from "../constants"

export const securityConfig: Partial<NextConfig> = {
  // Налаштування CSP (Content Security Policy)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              `img-src 'self' data: blob: ${ALLOWED_DOMAINS.join(" ")}`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-src 'self'",
              "media-src 'self'",
              "connect-src 'self'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

