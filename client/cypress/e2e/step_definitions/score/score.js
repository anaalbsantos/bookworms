const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

Given(
  'O usuário está logado com o username {string} e senha {string}',
  (username, senha) => {
    cy.visit('http://localhost:3000/Login');
    cy.get('input[name="emailORusername"]').type(username);
    cy.get('input[name="password"]').type(senha);
    cy.get('button').click();
  }
);

Given('O usuário está na página do grupo', () => {
  cy.get('[data-sidebar="menu-item"]').eq(1).click();
});

const today = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'short' });
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} de ${month}, ${hours}h${minutes}`;
};

Given('O usuário {string} já possui publicação no dia atual', (name) => {
  cy.get('[data-cy="post-card"]').each(($post) => {
    cy.wrap($post).find('[data-cy="author"]').should('exist', name);

    cy.wrap($post).find('[data-cy="date"]').should('exist', today);
  });
});

let scoreInitial;
Given(
  'O usuário vê seu nome {string} e sua pontuação atual no grupo',
  (name) => {
    cy.get('[data-cy^="ranking-name-"]', { timeout: 10000 })
      .contains(name)
      .parent()
      .within(() => {
        cy.get('[data-cy^="ranking-score-"]')
          .invoke('text')
          .then((text) => {
            scoreInitial = parseInt(text.replace(/\D/g, ''));
          });
      });
  }
);

When('O usuário seleciona a opção de adicionar uma publicação', () => {
  cy.get('[data-cy="add-post"]').click();
});

When(
  'O usuário faz publicação com legenda {string} e número de páginas {string}',
  (title, pages) => {
    cy.get('input[name="title"]', { timeout: 10000 }).type(title);
    cy.get('input[name="numPages"]').type(pages);
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/example-post.jpg',
      { force: true }
    );
    cy.get('[data-cy="submit-post"]').contains('Publicar').click();
  }
);
Then('O usuário é direcionado para a página {string}', (page) => {
  cy.url({ timeout: 40000 }).should('include', page);
});

Then('O usuário vê que sua pontuação atual aumentou em {string}', (score) => {
  cy.get('[data-cy^="ranking-score-"]', { timeout: 10000 })
    .invoke('text')
    .then((text) => {
      const scoreFinal = parseInt(text.replace(/\D/g, ''));
      expect(scoreFinal).to.equal(scoreInitial + parseInt(score));
    });
});
