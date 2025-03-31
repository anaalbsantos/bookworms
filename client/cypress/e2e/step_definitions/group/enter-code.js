const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps')

Given('eu estou na página inicial logado com usuario {string} e senha {string}', (user, password) => {
  cy.visit('http://localhost:3000')
  cy.get('input[name="emailORusername"]').type(user)
  cy.get('input[name="password"]').type(password)
  cy.get('button').click()
})

When('eu seleciono a opção criar grupo depois a opção entrar em grupo existente e preencho com código {string}', (codigo) => {
  cy.get('[data-sidebar="menu-item"]').eq(2).click()
  cy.get('[data-cy="entrar-existente"]').click()
  cy.get('[data-cy="input-modal"]').type(codigo)
  cy.get('[data-cy="confirmar-modal"]').click()

})

Then('eu sou redirecionado para pagina do grupo', () => {
  cy.url().should('eq', 'http://localhost:3000/Group');
})