Feature: criar grupo
As a usuario
I want to criar um grupo
So that eu possa postar e interagir com outros usuários

Scenario: Selecionar a opção criar grupo
Given eu estou na página inicial logado com o email "joazinho_44@gmail.com"
And eu não participo de nenhum grupo
When eu seleciono a opção "Criar Grupo"
Then eu sou transferido para a página de criação de grupo

Scenario: Não preencher os campos obrigatórios da criação de grupo
Given eu estou na página de criação de grupo logado com o email "joazinho_44@gmail.com"
And os campos "Nome do grupo", "Método de pontuação" e "Tempo de competição" não foram preenchidos
When eu preencho o campo "Nome do grupo" com "Férias 2015"
And eu preencho o campo "Método de pontuação" com "Páginas lidas"
And eu seleciono a opção "Criar grupo"
Then eu vejo a mensagem "Campo obrigatório não preenchido"
And o campo "Tempo da competição" é destacado

Scenario: Preencher os campos obrigatórios da criação de grupo
Given eu estou está na página de criação de grupo logado com o email "joazinho_44@gmail.com"
And apenas o campo "Tempo de competição" não foi preenchido
When eu preenche o campo "Tempo de competição" com "3 meses"
And eu seleciono "Criar grupo"
Then eu sou transferido para a página do grupo
And eu vejo o código do grupo
And eu agora faço parte do grupo