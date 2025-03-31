Feature: groups

Scenario: Selecionar a opção de entrar em um grupo
Given eu estou na página inicial logado com usuario "userdeArthur" e senha "arthur123"
When eu seleciono a opção Participar de um grupo
Then eu vejo a mensagem "Digite o código do grupo para entrar em um grupo existente!"

Scenario: Entrar em grupo existente
Given eu estou na página inicial logado com usuario "testeArthur" e senha "arthur123"
When eu seleciono a opção criar grupo depois a opção entrar em grupo existente e preencho com código "AAAAA"
Then eu sou redirecionado para pagina do grupo

Scenario: Criar grupo
Given eu estou na página inicial logado com usuario "userdeArthur" e senha "arthur123"
When eu seleciono a opção criar grupo depois preencho o nome como "supergrupo" seleciono o tipo "paginas" adiciono uma foto e seleciono o botao criar grupo
Then eu sou redirecionado para pagina do grupo e consigo ver o nome "supergrupo"

Scenario: Resetar grupo
Given eu estou logado com usuario "testeArthur" e senha "arthur123" na pagina "/EndGroup"
When eu seleciono o botao resetar grupo
Then eu sou redirecionado para pagina do grupo

Scenario: Sair do grupo após fim
Given eu estou logado com usuario "testeArthur" e senha "arthur123" na pagina "/EndGroup"
When eu seleciono o botao sair do grupo
Then eu sou redirecionado para o perfil
