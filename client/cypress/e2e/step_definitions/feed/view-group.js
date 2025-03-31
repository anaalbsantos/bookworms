import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given("I'm logged in and have a group", () => {
  cy.visit('http://localhost:3000/Login')
  cy.get('input[name="emailORusername"]').type('thaisinha')
  cy.get('input[name="password"]').type('bieberfever')
  cy.get('button').click()
  cy.get('img[alt="WormBig"]', { timeout: 10000 }).should('exist')
})

When("I visit the group page", () => {
  cy.get('[data-sidebar="menu-item"]').eq(1).click()
})

Then("I should see the group cover with name, type and duration", () => {
  cy.contains('div', 'fantástico mundo de thaís').should('exist')
  cy.contains('h1', 'Código do grupo').should('exist')
  cy.contains('h1', 'Até').should('exist')
  cy.contains('p', 'CHECKIN').should('exist')
  cy.get('img[alt="group-cover"]').should('exist')
})


And("I should see a list of posts", () => {
  cy.get('[data-testid="posts-container"]').should('exist')
  cy.contains('[data-testid="posts-container"]', 'by', {timeout:150000}).should('exist')
})

And("I should see the ranking section", () => {
  cy.get('[data-testid="ranking"]').should('exist')
})
