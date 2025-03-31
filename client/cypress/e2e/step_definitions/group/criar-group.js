const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps')

Given('eu estou na página inicial logado com usuario {string} e senha {string}', (user, password) => {
  cy.visit('http://localhost:3000')
  cy.get('input[name="emailORusername"]').type(user)
  cy.get('input[name="password"]').type(password)
  cy.get('button').click()
})

When('eu seleciono a opção criar grupo depois preencho o nome como {string} seleciono o tipo {string} adiciono uma foto e seleciono o botao criar grupo', (nome, tipo) => {
  cy.get('[data-sidebar="menu-item"]').eq(2).click()
  cy.get('[data-cy="input-nome-grupo"]').type(nome)
  cy.get('[data-cy="roll-input"]').select('PAGES');
  cy.get('input[type="file"]').first().selectFile('cypress/fixtures/example-group.jpg', { force: true });
  cy.get('[data-cy="criar-grupo"]').click()
})

Then('eu sou redirecionado para pagina do grupo e consigo ver o nome {string}', (nome) => {
  cy.url().should('eq', 'http://localhost:3000/Group');
  cy.contains('h1', nome).should('exist');
})