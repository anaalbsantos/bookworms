Feature: Login

Scenario: Login válido com username
Given O usuário está na página de login
When O usuário digita seu username "nalaura" e sua senha "Nalaura!123"
And O usuário seleciona a opção de login
Then O usuário deve ser redirecionado para "/Profile"

Scenario: Login válido com email
Given O usuário está na página de login
When O usuário digita seu email "alas4@cin.ufpe.br" e sua senha "Nalaura!123"
And O usuário seleciona a opção de login
Then O usuário deve ser redirecionado para "/Profile"

Scenario: Login com senha incorreta
Given O usuário está na página de login
When O usuário digita seu username "nalaura" e sua senha "Nalaura123"
And O usuário seleciona a opção de login
Then O usuário continua na página "/Login"
And O usuário recebe a mensagem de erro "Credenciais inválidas"

Scenario: Login com username incorreto
Given O usuário está na página de login
When O usuário digita seu username "laura" e sua senha "Nalaura!123"
And O usuário seleciona a opção de login
Then O usuário continua na página "/Login"
And O usuário recebe a mensagem de erro "Credenciais inválidas"