import "cypress-wait-until"

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>
      createArticle(title: string, content: string): Chainable<Element>
      deleteArticle(title: string): Chainable<Element>
      waitForArticleToBeDeleted(title: string): Chainable<Element>
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/admin/login")
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add("createArticle", (title: string, content: string) => {
  cy.visit("/admin/articles")
  cy.get('[data-testid="create-article"]').click()
  cy.get('input[name="title"]').type(title)
  cy.get('textarea[name="content"]').type(content)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add("deleteArticle", (title: string) => {
  cy.visit("/admin/articles")
  cy.contains(title).parent().find('[data-testid="delete-article"]').click()
  cy.get('[data-testid="confirm-delete"]').click()
})

Cypress.Commands.add("waitForArticleToBeDeleted", (title: string) => {
  cy.waitUntil(() => cy.contains(title).should("not.exist"), {
    timeout: 10000,
    interval: 500,
    errorMsg: `Article "${title}" was not deleted within the timeout period.`,
  })
})

