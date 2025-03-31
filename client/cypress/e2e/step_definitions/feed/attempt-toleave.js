import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given("I'm on the group page", () => {
  cy.visit('http://localhost:3000/Login')
  cy.get('input[name="emailORusername"]').type('thaisinha')
  cy.get('input[name="password"]').type('bieberfever')
  cy.get('button').click()
  cy.get('[data-sidebar="menu-item"]').eq(1).click()
})

When("I click on 'Sair do Grupo' button", () => {
  cy.visit('http://localhost:3000/Group')
  cy.get('button').eq(3).click()
})

Then("I should see a confirmation popup", () => {
  cy.contains('div', 'Tem certeza que deseja sair do grupo?')
})

When("I click 'Cancelar'", () => {
  cy.get('button').contains('Cancelar').click()
})

Then("the popup should close", () => {
  cy.contains('div', 'Tem certeza que deseja sair do grupo?').should('not.exist')
});
