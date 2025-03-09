import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Articles } from "@/components/admin/Articles/Articles"
import { useArticles } from "@/hooks/useArticles"
import { mockArticles } from "@/mocks/data"

jest.mock("@/hooks/useArticles")

describe("Articles Integration", () => {
  beforeEach(() => {
    ;(useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      createArticle: jest.fn(),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn(),
    })
  })

  it("displays articles list and handles article creation", async () => {
    const createArticle = jest.fn()
    ;(useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      createArticle,
    })

    render(<Articles />)

    // Перевіряємо відображення списку
    expect(screen.getByText(mockArticles[0].title)).toBeInTheDocument()

    // Відкриваємо форму створення
    fireEvent.click(screen.getByText(/створити статтю/i))

    // Заповнюємо форму
    fireEvent.change(screen.getByLabelText(/заголовок/i), {
      target: { value: "Нова стаття" },
    })
    fireEvent.change(screen.getByLabelText(/зміст/i), {
      target: { value: "Текст статті" },
    })

    // Відправляємо форму
    fireEvent.click(screen.getByText(/зберегти/i))

    await waitFor(() => {
      expect(createArticle).toHaveBeenCalledWith({
        title: "Нова стаття",
        content: "Текст статті",
      })
    })
  })

  it("handles article update and deletion", async () => {
    const updateArticle = jest.fn()
    const deleteArticle = jest.fn()
    ;(useArticles as jest.Mock).mockReturnValue({
      articles: mockArticles,
      loading: false,
      error: null,
      updateArticle,
      deleteArticle,
    })

    render(<Articles />)

    // Відкриваємо редагування
    fireEvent.click(screen.getByTestId(`edit-${mockArticles[0].id}`))

    // Змінюємо заголовок
    fireEvent.change(screen.getByLabelText(/заголовок/i), {
      target: { value: "Оновлений заголовок" },
    })

    // Зберігаємо зміни
    fireEvent.click(screen.getByText(/зберегти/i))

    await waitFor(() => {
      expect(updateArticle).toHaveBeenCalledWith(mockArticles[0].id, {
        title: "Оновлений заголовок",
        content: mockArticles[0].content, // Ensure content is also updated.  This was missing.
      })
    })

    // Видаляємо статтю
    fireEvent.click(screen.getByTestId(`delete-${mockArticles[0].id}`))
    fireEvent.click(screen.getByText(/підтвердити/i))

    await waitFor(() => {
      expect(deleteArticle).toHaveBeenCalledWith(mockArticles[0].id)
    })
  })

  it("handles error state", () => {
    ;(useArticles as jest.Mock).mockReturnValue({
      articles: [],
      loading: false,
      error: "Failed to fetch articles",
      createArticle: jest.fn(),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn(),
    })

    render(<Articles />)
    expect(screen.getByText(/Failed to fetch articles/i)).toBeInTheDocument()
  })

  it("handles loading state", () => {
    ;(useArticles as jest.Mock).mockReturnValue({
      articles: [],
      loading: true,
      error: null,
      createArticle: jest.fn(),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn(),
    })

    render(<Articles />)
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
  })
})

