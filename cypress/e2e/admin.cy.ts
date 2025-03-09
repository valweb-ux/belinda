/// <reference types="cypress" />
describe("Admin Panel E2E", () => {
  beforeEach(() => {
    // Логінимось перед кожним тестом
    cy.visit("/admin/login")
    cy.get('input[name="email"]').type("admin@example.com")
    cy.get('input[name="password"]').type("admin123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/admin/dashboard")
  })

  it("navigates through admin panel", () => {
    // Перевіряємо навігацію
    cy.get('[data-testid="nav-articles"]').click()
    cy.url().should("include", "/admin/articles")

    cy.get('[data-testid="nav-users"]').click()
    cy.url().should("include", "/admin/users")

    cy.get('[data-testid="nav-settings"]').click()
    cy.url().should("include", "/admin/settings")
  })

  it("creates and manages article", () => {
    cy.visit("/admin/articles")

    // Створюємо статтю
    cy.get('[data-testid="create-article"]').click()
    cy.get('input[name="title"]').type("Test Article")
    cy.get('textarea[name="content"]').type("Article content")
    cy.get('button[type="submit"]').click()

    // Перевіряємо створення
    cy.contains("Test Article").should("be.visible")

    // Редагуємо статтю
    cy.get('[data-testid="edit-article"]').first().click()
    cy.get('input[name="title"]').clear().type("Updated Article")
    cy.get('button[type="submit"]').click()

    // Перевіряємо оновлення
    cy.contains("Updated Article").should("be.visible")

    // Видаляємо статтю
    cy.get('[data-testid="delete-article"]').first().click()
    cy.get('[data-testid="confirm-delete"]').click()

    // Перевіряємо видалення
    cy.contains("Updated Article").should("not.exist")
  })

  it("manages user permissions", () => {
    cy.visit("/admin/users")

    // Створюємо користувача
    cy.get('[data-testid="create-user"]').click()
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('select[name="role"]').select("editor")
    cy.get('button[type="submit"]').click()

    // Перевіряємо створення
    cy.contains("Test User").should("be.visible")

    // Змінюємо роль
    cy.get('[data-testid="edit-user"]').first().click()
    cy.get('select[name="role"]').select("admin")
    cy.get('button[type="submit"]').click()

    // Перевіряємо оновлення
    cy.contains("admin").should("be.visible")
  })

  it("updates system settings", () => {
    cy.visit("/admin/settings")

    // Змінюємо налаштування
    cy.get('input[name="site_name"]').clear().type("New Site Name")
    cy.get('button[type="submit"]').click()

    // Перевіряємо збереження
    cy.get(".success-message").should("be.visible")

    // Перезавантажуємо сторінку
    cy.reload()

    // Перевіряємо збережені налаштування
    cy.get('input[name="site_name"]').should("have.value", "New Site Name")
  })

  it("handles file uploads", () => {
    cy.visit("/admin/files")

    // Завантажуємо файл
    cy.get('input[type="file"]').attachFile("test-image.jpg")

    // Перевіряємо завантаження
    cy.get(".upload-progress").should("exist")
    cy.get(".file-list").should("contain", "test-image.jpg")

    // Видаляємо файл
    cy.get('[data-testid="delete-file"]').first().click()
    cy.get('[data-testid="confirm-delete"]').click()

    // Перевіряємо видалення
    cy.contains("test-image.jpg").should("not.exist")
  })
})

