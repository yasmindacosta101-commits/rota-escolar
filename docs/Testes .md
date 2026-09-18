# Testes — Rota Escolar

## 1. Objetivo

Este documento apresenta os testes realizados no sistema Rota Escolar, verificando o funcionamento das principais funcionalidades definidas para o projeto.

## 2. Ambiente de testes

- Sistema: Rota Escolar
- Plataforma: computador (PC)
- Tecnologias: HTML, CSS, JavaScript e Firebase
- Autenticação: Firebase Authentication
- Banco de dados: Cloud Firestore

## 3. Teste de login da Escola

**Objetivo:** verificar se um usuário com perfil de escola consegue acessar o sistema.

**Procedimento:**
1. Informar e-mail cadastrado.
2. Informar senha cadastrada.
3. Clicar em "Entrar".

**Resultado esperado:** o sistema deve autenticar o usuário e apresentar a área da Escola.

**Resultado obtido:** acesso realizado com sucesso.

**Status:** Aprovado.

## 4. Teste de login do Motorista

**Objetivo:** verificar se o motorista consegue acessar o sistema utilizando seu e-mail e senha.

**Procedimento:**
1. Cadastrar o motorista no Firebase Authentication.
2. Criar o documento correspondente na coleção `usuarios`.
3. Informar `papel` como `motorista`.
4. Informar o `rotaId` correspondente à rota do motorista.
5. Informar o `motoristaId` correspondente ao cadastro do motorista.
6. Realizar o login.

**Resultado esperado:** o motorista deve ser autenticado e acessar sua área, com sua rota vinculada.

**Resultado obtido:** login realizado com sucesso e rota vinculada corretamente.

**Status:** Aprovado.

## 5. Teste de cadastro de alunos

**Objetivo:** verificar o cadastro de alunos no sistema.

**Procedimento:**
1. Acessar a área de alunos.
2. Preencher os dados solicitados.
3. Salvar o cadastro.

**Resultado esperado:** o aluno deve ser cadastrado e aparecer na lista de alunos.

**Resultado obtido:** cadastro realizado e dados apresentados na lista.

**Status:** Aprovado.

## 6. Teste de cadastro de motoristas

**Objetivo:** verificar o cadastro de motoristas.

**Procedimento:**
1. Acessar a área de motoristas.
2. Informar os dados do motorista.
3. Salvar o cadastro.

**Resultado esperado:** o motorista deve ser cadastrado e aparecer na lista.

**Resultado obtido:** cadastro realizado e motorista apresentado na lista.

**Status:** Aprovado.

## 7. Teste de cadastro de rotas

**Objetivo:** verificar se uma nova rota pode ser cadastrada.

**Procedimento:**
1. Acessar a área de rotas.
2. Informar o nome da rota.
3. Informar o turno.
4. Selecionar o motorista responsável.
5. Salvar a rota.

**Resultado esperado:** a rota deve ser cadastrada e ficar disponível no sistema.

**Resultado obtido:** rota cadastrada e disponibilizada no sistema.

**Status:** Aprovado.

## 8. Teste de cadastro de pontos de embarque

**Objetivo:** verificar o cadastro dos pontos de embarque.

**Procedimento:**
1. Acessar a área de pontos.
2. Informar o nome do ponto.
3. Informar o endereço/localização.
4. Informar a ordem do ponto.
5. Salvar.

**Resultado esperado:** o ponto deve ser cadastrado e ficar disponível para associação à rota.

**Resultado obtido:** ponto cadastrado corretamente.

**Status:** Aprovado.

## 9. Teste de associação de alunos

**Objetivo:** verificar a associação de um aluno a uma rota e a um ponto de embarque.

**Procedimento:**
1. Selecionar o aluno.
2. Selecionar a rota.
3. Selecionar o ponto de embarque.
4. Salvar a associação.

**Resultado esperado:** o aluno deve ficar associado à rota e ao ponto selecionados.

**Resultado obtido:** associação realizada corretamente.

**Status:** Aprovado.

## 10. Teste de consulta da rota pelo Motorista

**Objetivo:** verificar se o motorista consegue consultar sua própria rota.

**Procedimento:**
1. Entrar no sistema como motorista.
2. Acessar a área da rota.
3. Consultar os pontos de embarque.

**Resultado esperado:** o sistema deve apresentar a rota vinculada ao motorista e seus respectivos pontos.

**Resultado obtido:** rota vinculada apresentada corretamente.

**Status:** Aprovado.

## 11. Teste de consulta dos alunos por ponto

**Objetivo:** verificar se o motorista consegue visualizar os alunos de cada ponto.

**Procedimento:**
1. Entrar como motorista.
2. Selecionar um ponto de embarque.
3. Consultar os alunos associados ao ponto.

**Resultado esperado:** o sistema deve apresentar os alunos que devem embarcar naquele ponto.

**Resultado obtido:** alunos apresentados conforme a associação cadastrada.

**Status:** Aprovado.

## 12. Teste de registro de embarque

**Objetivo:** verificar o registro da situação de embarque dos alunos.

**Procedimento:**
1. Entrar como motorista.
2. Acessar a área de registro de embarque.
3. Selecionar o aluno.
4. Selecionar "Embarcou" ou "Não embarcou".
5. Salvar o registro.

**Resultado esperado:** o sistema deve registrar a situação do aluno.

**Resultado obtido:** registro realizado de acordo com a opção selecionada.

**Status:** Aprovado.

## 13. Teste de logout

**Objetivo:** verificar se o usuário consegue sair do sistema.

**Procedimento:**
1. Estar conectado ao sistema.
2. Clicar em "Sair".

**Resultado esperado:** a sessão deve ser encerrada e o usuário deve retornar à tela de login.

**Resultado obtido:** logout realizado corretamente.

**Status:** Aprovado.

## 14. Teste de atualização da página

**Objetivo:** verificar se os dados cadastrados permanecem disponíveis após atualizar a página.

**Procedimento:**
1. Cadastrar dados no sistema.
2. Atualizar a página.
3. Consultar novamente os registros.

**Resultado esperado:** os dados salvos no Firestore devem continuar disponíveis após a atualização.

**Resultado obtido:** os dados persistidos no Firestore permanecem disponíveis quando são carregados novamente pelo sistema.

**Status:** Aprovado.

## 15. Teste de integração com o Firebase

**Objetivo:** verificar a comunicação entre o sistema e os serviços Firebase.

**Procedimento:**
1. Realizar login pelo Firebase Authentication.
2. Cadastrar e consultar dados.
3. Verificar os documentos correspondentes no Cloud Firestore.

**Resultado esperado:** os dados devem ser enviados e consultados corretamente no Firebase.

**Resultado obtido:** integração realizada com Firebase Authentication e Cloud Firestore.

**Status:** Aprovado.

## 16. Teste de facilidade de uso

**Objetivo:** verificar se as principais funções podem ser encontradas e utilizadas de forma simples.

**Procedimento:**
1. Acessar as principais telas.
2. Utilizar os menus e botões.
3. Realizar cadastros e consultas.

**Resultado esperado:** as funções devem estar organizadas de forma clara e compreensível.

**Resultado obtido:** as principais funções foram organizadas por áreas do sistema.

**Status:** Aprovado.

## 17. Teste de organização das informações

**Objetivo:** verificar se as informações de alunos, motoristas, rotas e pontos são apresentadas de forma organizada.

**Resultado esperado:** os dados devem aparecer separados por suas respectivas funcionalidades.

**Resultado obtido:** informações organizadas nas áreas correspondentes.

**Status:** Aprovado.

## 18. Resumo dos resultados

| Funcionalidade | Resultado |
|---|---|
| Login da Escola | Aprovado |
| Login do Motorista | Aprovado |
| Cadastro de alunos | Aprovado |
| Cadastro de motoristas | Aprovado |
| Cadastro de rotas | Aprovado |
| Cadastro de pontos | Aprovado |
| Associação de alunos | Aprovado |
| Consulta da rota | Aprovado |
| Consulta de alunos por ponto | Aprovado |
| Registro de embarque | Aprovado |
| Logout | Aprovado |
| Persistência dos dados | Aprovado |
| Integração com Firebase | Aprovado |
| Facilidade de uso | Aprovado |
| Organização das informações | Aprovado |

## 19. Conclusão dos testes

Os testes realizados verificaram as principais funcionalidades do Rota Escolar, incluindo autenticação, cadastros, associação de alunos, consulta de rotas, registro de embarque e integração com o Firebase.

Os resultados indicam que as funcionalidades testadas estão funcionando de acordo com a proposta do projeto.
