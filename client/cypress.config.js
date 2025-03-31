const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require("cypress");

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
    },
    specPattern: "cypress/e2e/step_definitions/*.feature"
  },
});