Feature: Gerenciamento de pontos

Scenario: Ganho de pontos por páginas lidas
    Given O usuário está logado com o username "nalaura" e senha "Nalaura!123"
    And O usuário está na página do grupo
    And O usuário vê seu nome "Ana Laura" e sua pontuação atual no grupo
    When O usuário seleciona a opção de adicionar uma publicação
    And O usuário faz publicação com legenda "Leitura do dia" e número de páginas "15"
    Then O usuário é direcionado para a página "/PubliDetails"
    And O usuário vê que sua pontuação atual aumentou em "15"

Scenario: Ganho de pontos por check-in
    Given O usuário está logado com o username "loirinha" e senha "Loirinha13"
    And O usuário está na página do grupo
    And O usuário vê seu nome "taylor" e sua pontuação atual no grupo
    And O usuário "taylor" já possui publicação no dia atual
    When O usuário seleciona a opção de adicionar uma publicação
    And O usuário faz publicação com legenda "livro de hoje" e número de páginas "15"
    Then O usuário é direcionado para a página "/PubliDetails"
    And O usuário vê que sua pontuação atual aumentou em "0"