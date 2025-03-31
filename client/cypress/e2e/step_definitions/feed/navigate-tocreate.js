import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given("I'm on the group page", () => {
  cy.visit('http://localhost:3000')
  cy.get('input[name="emailORusername"]').type('thaisinha')
  cy.get('input[name="password"]').type('bieberfever')
  cy.get('button').click()
  cy.get('[data-sidebar="menu-item"]').eq(1).click()
})

When("I click on 'Adicionar publicação' button", () => {
  cy.visit('http://localhost:3000/Group')
  cy.get('button').eq(2).click()
})

Then("I should be redirected to the create post page", () => {
  cy.url().should('include', '/CreateEditPost')
})

