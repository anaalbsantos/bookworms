const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps')

Given('eu estou logado com usuario {string} e senha {string} na pagina {string}', (user, password, pagina) => {
  cy.visit('http://localhost:3000')
  cy.get('input[name="emailORusername"]').type(user)
  cy.get('input[name="password"]').type(password)
  cy.get('button').click()
  cy.get('[data-sidebar="menu-item"]').eq(1).click()
  cy.wait(5000)
  cy.visit(`http://localhost:3000${pagina}`)
  cy.wait(5000)
})

When('eu seleciono o botao resetar grupo', () => {
  cy.get('[data-cy="botao-resetar"]').click()
})

Then('eu sou redirecionado para pagina do grupo', (nome) => {
  cy.url().should('eq', 'http://localhost:3000/Group', { timeout: 15000 });
})