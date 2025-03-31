import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('O usuário está na página de login', () => {
  cy.visit('http://localhost:3000/Login');
});

When(
  'O usuário digita seu username {string} e sua senha {string}',
  (username, senha) => {
    cy.get('input[name="emailORusername"]').type(username);
    cy.get('input[name="password"]').type(senha);
  }
);

When(
  'O usuário digita seu email {string} e sua senha {string}',
  (email, senha) => {
    cy.get('input[name="emailORusername"]').type(email);
    cy.get('input[name="password"]').type(senha);
  }
);

When('O usuário seleciona a opção de login', () => {
  cy.get('button').click();
});

Then('O usuário deve ser redirecionado para {string}', (page) => {
  cy.url().should('include', page);
});

Then('O usuário continua na página {string}', (page) => {
  cy.url().should('include', page);
});

Then('O usuário recebe a mensagem de erro {string}', (msg) => {
  cy.get(`[data-cy="error-message"]`).should('contain', msg);
});