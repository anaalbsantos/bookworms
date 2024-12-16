Feature: Fim do tempo de competição de um grupo
As a usuário
I want to finalizar a competição de um grupo ou reiniciar a competição de um grupo
so that eu possa continuar interagindo com outros usuários

Scenario: Resetar o grupo
Given eu estou na página do grupo de nome "Férias 2010" logado com o email "joazinho_44@gmail.com"
And eu fui o criador do grupo "Férias 2010"
And o tempo de competição de "3 meses" do grupo acabou
And eu vejo a mensagem "Fim da competição"
And eu vejo as opções "Resetar grupo" e "Deletar grupo"
When eu seleciono "Resetar grupo"
Then As pontuações dos usuários são resetadas
And eu vejo "tempo restante: 3 meses"

Scenario: Deletar grupo
Given eu estou na página do grupo de nome "Férias 2010" logado com o email "joazinho_44@gmail.com"
And eu fui o criador do grupo "Férias 2010"
And os usuários "mariazinha", "pedrinho" e "vitinho" fazem parte do grupo
And o tempo de competição de "3 meses" do grupo acabou
And eu vejo a mensagem "Fim da competição"
And eu vejo as opções "Resetar grupo" e "Deletar grupo"
When eu seleciono "Deletar grupo"
Then eu sou direcionado para a página inicial
And eu e os usuários "mariazinha", "pedrinho" e "vitinho" não fazemos parte de nenhum grupo
