import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Login } from "@/components/admin/Login/Login"
import { signIn } from "next-auth/react"

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}))

describe("Login Component", () => {
  beforeEach(() => {
    ;(signIn as jest.Mock).mockClear()
  })

  it("renders login form", () => {
    render(<Login />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /увійти/i })).toBeInTheDocument()
  })

  it("shows validation errors for empty fields", async () => {
    render(<Login />)

    fireEvent.click(screen.getByRole("button", { name: /увійти/i }))

    await waitFor(() => {
      expect(screen.getByText(/email обов'язковий/i)).toBeInTheDocument()
      expect(screen.getByText(/пароль обов'язковий/i)).toBeInTheDocument()
    })
  })

  it("calls signIn with correct credentials", async () => {
    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/пароль/i), {
      target: { value: "password123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /увійти/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      })
    })
  })

  it("shows error message on failed login", async () => {
    ;(signIn as jest.Mock).mockResolvedValueOnce({
      error: "InvalidCredentials",
    })

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/пароль/i), {
      target: { value: "wrongpassword" },
    })
    fireEvent.click(screen.getByRole("button", { name: /увійти/i }))

    await waitFor(() => {
      expect(screen.getByText(/невірний email або пароль/i)).toBeInTheDocument()
    })
  })
})

