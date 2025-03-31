import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given("I'm logged in without a group", () => {
  cy.visit('http://localhost:3000/Login')
  cy.get('input[name="emailORusername"]').type('oliviarodrigo')
  cy.get('input[name="password"]').type('123456')
  cy.get('button').click()
  cy.get('img[alt="WormBig"]', { timeout: 10000 }).should('exist')
})

When("I visit the group page", () => {
  cy.get('[data-sidebar="menu-item"]').eq(1).click()
})

Then("I should see the no group message", () => {
  cy.contains('h1', 'Parece que você não participa de nenhum grupo :(').should('exist');
});
