Feature: Cadastro de usuários
    As a um novo usuário
    I want to me cadastrar
    So that eu possa criar uma conta e acessar os recursos do sistema


    Scenario: Cadastro com todos os campos obrigatórios preenchidos.
        Given que eu estou na página “Cadastro de Usuários”.
        When eu preencho os campos "Nome" com "Victor Oliveira"
        And "Username" com "victor123"
        And "Email" com "victor@email.com"
        And "Senha" com "123456"
        And "Confirmar Senha" com "123456".
        And eu clico em “Cadastrar”.
        Then eu vejo a mensagem “Cadastro realizado com sucesso”
        And sou redirecionado para a página “Login de Usuário”.




    Scenario: Cadastro com senha menor que o limite mínimo
        Given eu estou na página de “Cadastro de Usuários”.
        When eu preencho os campos "Nome" com "Victor Oliveira"
        And "Username" com "victor123"
        And "Email" com "victor@email.com"
        And "Senha" com "123"
        And "Confirmar Senha" com "123"
        And eu clico em “Cadastrar”.
        Then vejo a mensagem “A senha deve conter no mínimo 6 caracteres”
        And permaneço na página de “Cadastro de Usuário”


    Scenario: Cadastro com Username já existente.
        Given eu estou na página de “Cadastro de Usuário”.
        And o usuário “victor123” já está cadastrado.
        When eu preencho os campos "Nome" com "Victor Oliveira"
        And "Username" com "victor123"
        And "Email" com "victor@email.com"
        And "Senha" com "123456"
        And "Confirmar Senha" com "123456"
        And eu clico em “Cadastrar”
        Then eu vejo a mensagem “Username já em Uso”.
        And permaneço na página de “Cadastro de Usuário”.


    Scenario: Cadastro sem preencher campos obrigatórios
        Given eu estou na página de “Cadastro de Usuário”.
        When eu preencho os campos "Nome" com "Victor Oliveira"
        And "Username" com "victor123"
        And "Senha" com "123"
        And "Confirmar Senha" com "123".
        And deixo em branco o campo “Email”
        And eu clico em “Cadastrar”
        Then eu vejo a mensagem de erro “Campo obrigatório não preenchido”.
        And permaneço na página de “Cadastro de Usuários”.
