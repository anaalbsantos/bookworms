const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

Given('Eu estou na página de edição de perfil', () => {
  cy.visit('http://localhost:3000/EditProfile');
});

Given('O username atual é {string}', (username) => {
  cy.get('input[name="username"]').should('have.value', username);
});

When('Eu preencho o username com {string}', (username) => {
  cy.get('input[name="username"]').clear().type(username);
});

When('Eu clico no botão {string}', (botaoTexto) => {
  cy.contains('button', botaoTexto).click();
});

When('Eu recarrego a página manualmente', () => {
  cy.reload();

  cy.wait(1000);
});

Then('O username deve manter o valor {string}', (usernameEsperado) => {
  cy.get('input[name="username"]', { timeout: 10000 }).should(
    'have.value',
    usernameEsperado
  );
});
