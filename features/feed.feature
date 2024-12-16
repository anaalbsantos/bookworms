Feature: Feed de postagens de um grupo
    As a usuário membro de um grupo
    I want to acessar e interagir com o feed de postagens do grupo
    So that eu possa acompanhar as atualizações dos usuários sobre suas leituras

    Scenario: Exibir postagens no feed
        Given Eu estou logado com o email "thais@gmail.com" e senha "password123"
        And Eu participo do grupo de código "GRP123"
        And O grupo possui 5 postagens cadastrada
        When Eu acesso a página "Grupo"
        Then Eu vejo 5 postagens no feed em ordem cronológica decrescente
        And Cada postagem apresenta título, foto e horário da publicação


    Scenario: Visualizar uma postagem específica 
        Given Eu estou logado com o email "thais@gmail.com" e senha "password123"
        And Eu participo do grupo de código "GRP123"
        And Eu estou na página "Grupo"
        And O feed contém uma postagem do usuário "ana.laura" com o título "leitura do dia", 
            foto "capa-livro.jpg" e dia e horário "15 de dez.,11h28"
        When Eu seleciono a postagem de "ana.laura" no feed
        Then Eu a página de detalhes da postagem
        And Eu vejo o título "leitura do dia"
        And Eu vejo a legenda "não quero que esse livro acabe"
        And Eu vejo a foto "capa-livro.jpg" exibida em tamanho ampliado
        And Eu vejo o dia e horário da publicação como "15 de dezembro, 11h28"


    Scenario: Feed sem nenhuma publicação
        Given Eu estou logado com o email "thais@gmail.com" e senha "password123"
        And Eu participo do grupo de código "GRP456"
        And O grupo não possui postagens cadastradas
        When Eu acesso a página "Grupo"
        Then Eu vejo a mensagem "Parece que ainda não há leituras por aqui…" 
        And Eu vejo o botão "Convide seus amigos"


    Scenario: Atualizar o feed
        Given Eu estou logado com o email "thais@gmail.com" e senha "password123"
        And Eu participo do grupo de código "GRP789"
        And O grupo possui 10 postagens cadastradas
        And Eu estou na página "Grupo"
        And Há 2 novas postagens criadas desde que eu abri o grupo
        When Eu atualizo a página "Grupo"
        Then Eu vejo as 2 novas postagens no topo do feed
        And Eu vejo a mensagem "Feed atualizado"


    Scenario: Mensagem de erro
	    Given Eu estou logado com o email "thais@gmail.com" e senha "password123"
        And Eu participo do grupo de código "GRP789"
        And Eu estou na página "Grupo"
        And O feed não carrega as postagens
        When Eu tento atualizar o feed do "Grupo"
        Then Eu vejo a mensagem "Houve um problema.. Verifique sua conexão e tente novamente"
        And Eu vejo o botão "Tentar novamente"


    Scenario: Filtrar postagens por um usuário específico
	    Given Eu estou logado com o email "thais@gmail.com" e senha "password123"
        And Eu participo do grupo de código "GRP789"
        And O grupo contém 10 postagens no total, sendo 3 postagens do usuário "victor.silva"
        When Eu seleciono a opção "Filtrar por usuário"
        And Eu escolho o usuário "victor.silva"
        Then Eu vejo apenas as 3 postagens de "victor.silva" no feed

    Scenario: Paginação no feed
	    Given Eu estou logado com o email "thais@gmail.com" e senha "password123"
        And Eu participo do grupo de código "GRP987"
        And Eu estou na página "1" do "Grupo"
        And O grupo contém 25 postagens cadastradas
        And O grupo exibe apenas 10 postagens
        When Eu chego ao final da página
        And Eu seleciono a opção "Próxima página"
        Then Eu vejo mais 10 postagens da página "2" no feed

