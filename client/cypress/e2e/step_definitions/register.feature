Feature: Cadastro de usuário

    Scenario: Cadastro bem-sucedido com todos os campos válidos
        Given Eu estou na página de cadastro
        When Eu preencho o nome com "Joao Silva"
        And Eu preencho o username com "joaosilva"
        And Eu preencho o email com "joao@gmail.com"
        And Eu preencho a senha com "senhasegura"
        And Eu confirmo a senha com "senhasegura"
        And Eu seleciono uma imagem de perfil válida
        And Eu clico no botão "Cadastrar"
        Then Eu devo ser redirecionado para a página de login

    Scenario: Validação de senha curta
        Given Eu estou na página de cadastro
        When Eu preencho o nome com "Joao Silva"
        And Eu preencho o username com "joaosilvaa"
        And Eu preencho o email com "joao@gmail.com"
        And Eu preencho a senha com "1234"
        And Eu confirmo a senha com "1234"
        And Eu seleciono uma imagem de perfil válida
        And Eu clico no botão "Cadastrar"
        Then Eu vejo a mensagem de erro de senha curta
        And Eu permaneço na página de cadastro

    Scenario: Tentativa de cadastro com username muito curto
        Given Eu estou na página de cadastro
        When Eu preencho o nome com "Ana Silva"
        And Eu preencho o username com "an"
        And Eu preencho o email com "ana@gmail.com"
        And Eu preencho a senha com "senhasegura123"
        And Eu confirmo a senha com "senhasegura123"
        And Eu seleciono uma imagem de perfil válida
        And Eu clico no botão "Cadastrar"
        Then Eu vejo a mensagem de erro de username curto
        And Eu permaneço na página de cadastro