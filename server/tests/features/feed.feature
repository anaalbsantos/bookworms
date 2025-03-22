Feature: Feed de postagens de um grupo
  As usuário membro de um grupo
  I want to acessar e interagir com o feed de postagens

    Scenario: Obter feed de postagens de um grupo com publicações
      Given há um grupo no sistema com id "111"
      And há um usuário no sistema com id "123", username "thaís", groupId "111"
      And há um usuário no sistema com id "456", username "ana", groupId "111"
      And há um usuário no sistema com id "789", username "arthur", groupId "111"
      And há 3 postagens cadastradas no grupo "111" com os seguintes dados:
            | id   | authorId | title       | groupId | createdAt                 |
            | P001 | 789      | "Título A"  | "111"   | "2025-02-24T10:00:00Z"    |
            | P002 | 456      | "Título B"  | "111"   | "2025-02-24T09:00:00Z"    |
            | P003 | 123      | "Título C"  | "111"   | "2025-02-24T08:00:00Z"    |
      When uma requisição GET for enviada para "/feed/groups/111"
      Then o status da resposta deve ser "200"
      And deve ser retornado um JSON com uma lista de postagens em ordem cronológica decrescente
      And a postagem com id "P001" deve ser o elemento "0" da lista
      And a postagem com id "P002" deve ser o elemento "1" da lista
      And a postagem com id "P003" deve ser o elemento "2" da lista

    Scenario: Obter feed de postagens de um grupo sem publicações
      Given há um grupo no sistema com código "GRP456" e id "G456"
      And o grupo "G456" não possui postagens cadastradas
      When uma requisição GET for enviada para "/feed/groups/G456"
      Then o status da resposta deve ser "404"
      And deve ser retornado um JSON contendo a mensagem "Nenhum post encontrado!"

    Scenario: Filtrar postagens do feed por um usuário específico
      Given há um grupo no sistema com id "G789"
      And há 5 postagens cadastradas no grupo "G789" com os seguintes dados:
            | id   | authorId  | title      | groupId | createdAt                 |
            | P001 | 111       | "Post 1"   | "G789"  | "2025-02-24T10:00:00Z"    |
            | P002 | 222       | "Post 2"   | "G789"  | "2025-02-24T09:30:00Z"    |
            | P003 | 333       | "Post 3"   | "G789"  | "2025-02-24T09:00:00Z"    |
            | P004 | 444       | "Post 4"   | "G789"  | "2025-02-24T08:45:00Z"    |
            | P005 | 444       | "Post 5"   | "G789"  | "2025-02-24T08:30:00Z"    |
      When uma requisição GET for enviada para "/feed/groups/G789/user/444"
      Then o status da resposta deve ser "200"
      And deve ser retornado um JSON contendo apenas 2 postagens
      And a postagem com id "P004" deve ser o elemento "0" da lista
      And a postagem com id "P005" deve ser o elemento "1" da lista

    Scenario: Consultar feed de postagens para usuário sem publicações
      Given há um grupo no sistema com id "G111"
      And há um usuário no sistema com id "111", username "thaís", groupId "G111"
      And o usuário com id "111" é membro do grupo "G111"
      And não há postagens cadastradas para o usuário com id "111" no grupo "G111"
      When uma requisição GET for enviada para "/feed/groups/G111/user/111"
      Then o status da resposta deve ser "404"
      And deve ser retornado um JSON contendo a mensagem "Nenhum post encontrado para o usuário 111."

