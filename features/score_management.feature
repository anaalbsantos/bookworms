Feature: Gerenciamento de pontos dentro de um grupo
    As a usuário membro de um grupo
    I want to acompanhar e gerenciar meus pontos
    So that eu possa entender minha posição no ranking e competir eficientemente

    Scenario: Ganho de pontos por páginas lidas
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#"
        And Eu participo do grupo de código "XYZKIO" com pontuação por "Página Lidas"
        And Eu estou na página "Grupo"
        And Eu vejo que minha pontuação atual no grupo é "10"
        When Eu seleciono a opção "Adicionar publicação"
        And Eu faço uma publicação com legenda "Leitura do dia" e número de páginas "35"
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que minha pontuação atual é "45"
    
    Scenario: Ganho de pontos por check-in
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#" no dia "12/12/24"
        And Eu participo do grupo de código "XYZKIO" com pontuação por "Check-in"
        And Eu estou na página "Grupo"
        And Eu vejo que minha pontuação atual no grupo é "10"
        And Eu ainda não tenho publicação no dia "12/12/24"
        When Eu seleciono a opção "Adicionar publicação"
        And Eu faço uma publicação com legenda "Leitura de hoje"
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que minha pontuação atual é "11"

    Scenario: Redução de pontos com páginas lidas
        Given Given Eu estou logado com o email "ana@gmail.com" e senha "1234#"
        And Eu participo do grupo de código "XYZKIO" com pontuação por "Página Lidas"
        And Eu estou na página "Grupo"
        And Eu vejo que minha pontuação atual no grupo é "45"
        When Eu expando minha publicação com legenda "Leitura do dia" e número de páginas "35"
        And Eu seleciono a opção "Exluir publicação"
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que minha pontuação atual é "10"

    Scenario: Redução de pontos com check-in
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#" no dia "12/12/24"
        And Eu participo do grupo de código "XYZKIO" com pontuação por "Check-in"
        And Eu estou na página "Grupo"
        And Eu vejo que minha pontuação atual no grupo é "10"
        And Eu vejo que tenho 1 única publicação no dia "12/12/24" com legenda "Leitura do dia"
        When Eu expando minha publicação com legenda "Leitura do dia"
        And Eu seleciono a opção "Exluir publicação"
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que minha pontuação atual é "9"
    
    Scenario: Sem mudança de pontos com páginas lidas
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#"
        And Eu participo do grupo de código "XYZKIO" com pontuação por "Página Lidas"
        And Eu estou na página "Grupo"
        And Eu vejo que minha pontuação atual no grupo é "10"
        When Eu seleciono a opção "Adicionar publicação"
        And Eu faço uma publicação com legenda "Leitura do dia" e número de páginas "0"
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que minha pontuação atual é "10"
    
    Scenario: Sem mudança de pontos com check-in
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#" no dia "12/12/24"
        And Eu participo do grupo de código "XYZKIO" com pontuação por "Check-in"
        And Eu estou na página "Grupo"
        And Eu vejo que minha pontuação atual no grupo é "10"
        And Eu vejo que tenho uma publicação no dia "12/12/24" com legenda "Leitura da manhã"
        When Eu seleciono a opção "Adicionar publicação"
        And Eu faço uma publicação com legenda "Leitura da tarde"
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que minha pontuação atual é "10"
    
    Scenario: Mudança de posição no ranking por ganho de pontos
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#"
        And Eu participo do grupo de código "XYZKIO"
        And Eu estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"
        And Eu vejo que o usuário "Arthur" está em "2º lugar" no ranking com pontuação "10"
        And Eu vejo que eu estou em "3º lugar" no ranking com pontuação "8"
        When Eu ganho "3" na pontuação
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"
        And Eu vejo que eu estou em "2º lugar" no ranking com pontuação "11"
        And Eu vejo que o usuário "Arthur" está em "3º lugar" no ranking com pontuação "10"

    Scenario: Mudança de posição no ranking por perda de pontos
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#"
        And Eu participo do grupo de código "XYZKIO"
        And Eu estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"
        And Eu vejo que eu estou em "2º lugar" no ranking com pontuação "10"
        And Eu vejo que o usuário "Arthur" está em "2º lugar" no ranking com pontuação "8"
        When Eu perco "5" na pontuação
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"
        And Eu vejo que o usuário "Arthur" está em "2º lugar" no ranking com pontuação "8"
        And Eu vejo que eu estou em "3º lugar" no ranking com pontuação "5"

    Scenario: Inalteração de posição no ranking 
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#"
        And Eu participo do grupo de código "XYZKIO"
        And Eu estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"
        And Eu vejo que o usuário "Arthur" está em "2º lugar" no ranking com pontuação "10"
        And Eu vejo que eu estou em "3º lugar" no ranking com pontuação "8"
        When Eu ganho "1" na pontuação
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"O
        And Eu vejo que o usuário "Arthur" está em "2º lugar" no ranking com pontuação "10"
        And Eu vejo que eu estou em "3º lugar" no ranking com pontuação "9"
    
    Scenario: Empate de pontos
        Given Eu estou logado com o email "ana@gmail.com" e senha "1234#"
        And Eu participo do grupo de código "XYZKIO"
        And Eu estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"
        And Eu vejo que o usuário "Arthur" está em "2º lugar" no ranking com pontuação "10"
        And Eu vejo que eu estou em "3º lugar" no ranking com pontuação "8"
        When Eu ganho "2" na pontuação
        Then Eu ainda estou na página "Grupo"
        And Eu vejo que o usuário "Thaís" está em "1º lugar" no ranking com pontuação "12"
        And Eu vejo que o usuário "Arthur" está em "2º lugar" no ranking com pontuação "10"
        And Eu vejo que eu estou em "2º lugar" no ranking com pontuação "10"