Feature: Edição de perfil

    Background:
        Given Eu estou logado na aplicação

    Scenario: Alterar múltiplos campos do perfil
        Given Eu estou na página de edição de perfil
        When Eu preencho o nome com "Nome Atualizado"
        And Eu preencho o username com "malcolm"
        And Eu preencho a biografia com "Best Day Ever"
        And Eu preencho páginas totais com "150"
        And Eu preencho páginas lidas com "150"
        And Eu seleciono uma nova imagem de perfil
        And Eu clico no botão "Salvar"
        Then O nome deve ser atualizado para "Nome Atualizado"

    Scenario: Tentativa de salvar perfil com username contendo espaço em branco
        And Eu estou na página de edição de perfil
        And O username atual é "malcolm"
        When Eu preencho o username com " "
        And Eu clico no botão "Salvar"
        And Eu recarrego a página manualmente
        Then O username deve manter o valor "malcolm"
