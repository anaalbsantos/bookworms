Feature: Entrar ou sair de um grupo
As a usuário
I want to entrar em um grupo
so that eu possa interagir com outros usuários

Scenario: Selecionar a opção de entrar em um grupo
Given eu estou na página inicial logado com o email "joazinho_44@gmail.com"
And eu não participo de nenhum grupo
When eu seleciono a opção "Entrar em um grupo"
Then eu vejo mensagem "Digite o código do grupo"

Scenario: Preencher código corretamente
Given eu estou na página inicial logado com o email "joazinho_44@gmail.com" e selecionei "entrar em um grupo"
And existe um grupo com código "123abcdef"
When eu digito o código "123abcdef"
Then eu sou transferido para a página do grupo
And eu sou cadastrado no sistema como parte do grupo de código "123abcdef"

Scenario: Preencher código incorretamente
Given eu estou na página inicial logado com o email "joazinho_44@gmail.com" e selecionei "entrar em um grupo"
And existe um grupo com código "123abcdef"
When eu digito o código "abcdef123"
Then eu vejo a mensagem "Grupo inexistente"

Scenario: Seleciono a opção sair do grupo
Given eu estou logado com o email "joazinho_44@gmail.com" e faço parte do grupo "Costureiras do janga" 
And eu estou na página do grupo "Costureiras do janga"
When eu seleciono "Sair do grupo"
Then eu sou transferido para a página inicial
And eu não faço mais parte do grupo "Costureiras do janga"