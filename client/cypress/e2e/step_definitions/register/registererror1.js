const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

Given('Eu estou na página de cadastro', () => {
  cy.visit('http://localhost:3000/Register');
});

When('Eu preencho o nome com {string}', (nome) => {
  cy.get('input[name="name"]').type(nome);
});

When('Eu preencho o username com {string}', (username) => {
  cy.get('input[name="username"]').type(username);
});

When('Eu preencho o email com {string}', (email) => {
  cy.get('input[name="email"]').type(email);
});

When('Eu preencho a senha com {string}', (senha) => {
  cy.get('input[name="password"]').type(senha);
});

When('Eu confirmo a senha com {string}', (confirmacaoSenha) => {
  cy.get('input[name="confirmPassword"]').type(confirmacaoSenha);
});

When('Eu seleciono uma imagem de perfil válida', () => {
  cy.get('input[type="file"]').selectFile(
    'cypress/fixtures/example-profile.jpg',
    { force: true }
  );
});

When('Eu clico no botão {string}', (botaoTexto) => {
  cy.contains('button', botaoTexto).click();
});

Then('Eu vejo a mensagem de erro de username curto', () => {
  cy.get('p')
    .contains(
      '⚠︎ Erro no servidor: O username deve ter pelo menos 3 caracteres'
    )
    .should('exist');
});

Then('Eu permaneço na página de cadastro', () => {
  cy.url().should('include', '/Register');
  cy.contains('h1', 'cadastro').should('be.visible');
});
