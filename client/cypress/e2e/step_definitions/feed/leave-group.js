import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given("I'm on the group page", () => {
  cy.visit('http://localhost:3000/Login')
  cy.get('input[name="emailORusername"]').type('thaisinha')
  cy.get('input[name="password"]').type('bieberfever')
  cy.get('button').click()
  cy.get('img[alt="WormBig"]', { timeout: 10000 }).should('exist')
  cy.get('[data-sidebar="menu-item"]').eq(1).click()
})

When ("I click on the 'Sair do Grupo' button", () => {
  cy.get('button').contains('Sair do grupo').click()
})

And ("I click 'Sair do grupo' on the popup", () => {
  cy.get('button.bg-borrow:contains("Sair do Grupo")').click()
})

Then ("I should be redirected to the no group page", () => {
  cy.get('h1').contains('Parece que você não participa de nenhum grupo :(').should('exist')
  cy.url().should('include', '/NoGroup')
}
)
