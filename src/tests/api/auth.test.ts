import { createMocks } from "node-mocks-http"
import handler from "@/pages/api/auth/[...nextauth]"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/utils/security"
import { jest, describe, beforeEach, it, expect } from "@jest/globals"

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns user data for valid credentials", async () => {
    const hashedPassword = await hashPassword("password123")
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: "1",
      email: "test@example.com",
      password: hashedPassword,
      name: "Test User",
      role: "admin",
    })

    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "test@example.com",
        password: "password123",
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "admin",
      }),
    )
  })

  it("returns error for invalid credentials", async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null)

    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "wrong@example.com",
        password: "wrongpassword",
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(401)
    expect(JSON.parse(res._getData())).toEqual({
      error: "InvalidCredentials",
    })
  })
})

