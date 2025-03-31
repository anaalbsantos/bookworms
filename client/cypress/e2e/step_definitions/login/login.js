const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps')

Given("I'm on the front page", () => {
  cy.visit('https://bookworms-theta.vercel.app/Login')
})

When('I type the username {string} and the password {string}', (user, password) => {
  cy.get('input[name="emailORusername"]').type(user)
  cy.get('input[name="password"]').type(password)
  cy.get('button').click()
})

Then("I should see the bookworms logo", () => {
  cy.get('img[alt="WormBig"]').should('exist');
})