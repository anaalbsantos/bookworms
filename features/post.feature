Feature: Gerenciar publicações dentro de um grupo
As a usuário
I want to fazer uma publicação
So that eu possa atualizar outros usuários sobre minha leitura

Scenario: Realizar uma postagem
    Given eu estou na página inicial logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7"
    When eu seleciono a opção “Fazer publicação"
    Then eu sou transferido para a página de publicação

Scenario: Selecionar foto na página de publicação
    Given eu estou na página de publicação logado com o email "tress_2024@gmail.com"
    When eu seleciono a opção “Selecionar foto"
    Then eu sou transferido para a página de selecionar imagens
    And eu posso escolher uma imagem

Scenario: Fazer uma publicação só com campos obrigatórios em um grupo que pontua por “Páginas lidas"
    Given eu estou na página de publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Páginas lidas”
    And os campos “Imagem” e “Páginas lidas” estão preenchidos
    When eu seleciono a opção “Publicar"
    Then eu sou transferido para a página de feed
    And eu posso ver a minha publicação
    And os outros membros do grupo de código "ru3x7” podem ver a publicação

Scenario: Fazer uma publicação só com campos obrigatórios em um grupo que pontua por “Checking diário"
    Given eu estou na página de publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Checking diário”
    And o campo “Imagem” está preenchido
    When eu seleciono a opção “Publicar"
    Then eu sou transferido para a página de feed
    And eu posso ver a minha publicação
    And os outros membros do grupo de código "ru3x7” podem ver a publicação

Scenario: Fazer uma publicação com todos os campos em um grupo que pontua por “Páginas lidas"
    Given eu estou na página de publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Páginas lidas”
    And os campos “Imagem”, “Legenda” e “Páginas lidas” estão preenchidos
    When eu seleciono a opção “Publicar"
    Then eu sou transferido para a página de feed
    And eu posso ver a minha publicação
    And os outros membros do grupo de código "ru3x7” podem ver a publicação

Scenario: Fazer uma publicação com todos os campos em um grupo que pontua por “Checking diário"
    Given eu estou na página de publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Checking diário”
    And os campos “Imagem” e “Legenda” estão preenchidos
    When eu seleciono a opção “Publicar"
    Then eu sou transferido para a página de feed
    And eu posso ver a minha publicação
    And os outros membros do grupo de código "ru3x7” podem ver a publicação

Scenario: Fazer uma publicação sem os campos obrigatórios
    Given eu estou na página de publicação logado com o email "tress_2024@gmail.com"
    And o campo “Imagem” não está preenchido
    When eu seleciono a opção “Publicar"
    Then eu permaneço na página de publicação
    And eu vejo a mensagem “Sua publicação precisa ter uma imagem”

Scenario: Editar uma publicação já feita em um grupo que pontua por “Páginas lidas"
    Given eu estou na página de detalhes de uma publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Páginas lidas”
    When eu seleciono a opção “Editar"
    Then eu sou transferido para a página de edição de publicações
    And eu posso alterar os campos “Imagem”, “Legenda” e “Páginas lidas”
    And eu posso publicar novamente
    And o horário e data da publicação é atualizado

Scenario: Editar uma publicação já feita em um grupo que pontua por “Checking diário"
    Given eu estou na página de detalhes de uma publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Checking diário”
    When eu seleciono a opção “Editar"
    Then eu sou transferido para a página de edição de publicações
    And eu posso alterar os campos “Imagem” e “Legenda”
    And eu posso publicar novamente
    And o horário e data da publicação é atualizado

Scenario: Excluir uma publicação em um grupo que pontua por “Páginas lidas”
    Given eu estou na página de detalhes de uma publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Páginas lidas”
    When eu seleciono a opção “Excluir"
    And eu recebo a mensagem “Tem certeza que deseja excluir? Isso irá alterar sua pontuação”
    And eu escolho “Sim”
    Then A publicação é removida do feed de publicações
    And os pontos do usuário são atualizados

Scenario: Excluir uma publicação em um grupo que pontua por “Checking diário”
    Given eu estou na página de detalhes de uma publicação logado com o email "tress_2024@gmail.com"
    And eu participo de um grupo de código "ru3x7”
    And o grupo de código "ru3x7” pontua por "Checking diário”
    When eu seleciono a opção “Excluir"
    And eu recebo a mensagem “Tem certeza que deseja excluir? Isso poderá alterar sua pontuação”
    And eu escolho “Sim”
    Then A publicação é removida do feed de publicações
    And os pontos do usuário são atualizados