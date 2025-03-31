const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps')

Given('eu estou na página inicial logado com usuario {string} e senha {string}', (user, password) => {
  cy.visit('http://localhost:3000')
  cy.get('input[name="emailORusername"]').type(user)
  cy.get('input[name="password"]').type(password)
  cy.get('button').click()
})

When('eu seleciono a opção Participar de um grupo', () => {
  cy.get('[data-sidebar="menu-item"]').eq(3).click()
})

Then("eu vejo a mensagem {string}", (message) => {
  cy.contains('h2', message)
    .should('be.visible');
})