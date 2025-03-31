const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

Given('Eu estou logado na aplicação', () => {
  cy.visit('http://localhost:3000/');
  cy.get('input[name="emailORusername"]').type('malcolm');
  cy.get('input[name="password"]').type('5dollarponyride');
  cy.get('button').click();
  cy.url().should('include', '/Profile'); // Verifica se foi para a página de perfil após login
});

Given('Eu estou na página de edição de perfil', () => {
  cy.visit('http://localhost:3000/EditProfile');
});

When('Eu preencho o nome com {string}', (nome) => {
  cy.get('input[name="name"]').clear().type(nome);
});

When('Eu preencho o username com {string}', (username) => {
  cy.get('input[name="username"]').clear().type(username);
});

When('Eu preencho o email com {string}', (email) => {
  cy.get('input[name="email"]').clear().type(email);
});

When('Eu preencho a biografia com {string}', (biografia) => {
  cy.get('textarea[name="biography"]').clear().type(biografia);
});

When('Eu preencho páginas totais com {string}', (paginas) => {
  cy.get('input[name="score"]').first().clear().type(paginas);
});

When('Eu preencho páginas lidas com {string}', (paginas) => {
  cy.get('input[name="score"]').last().clear().type(paginas);
});

When('Eu seleciono uma nova imagem de perfil', () => {
  cy.get('input[type="file"]')
    .first()
    .selectFile('cypress/fixtures/yuel.jpg', { force: true });
});

When('Eu clico no botão {string}', (botaoTexto) => {
  cy.contains('button', botaoTexto).click();
});

Then('O nome deve ser atualizado para {string}', (nome) => {
  cy.get('input[name="name"]').should('have.value', nome);
});
