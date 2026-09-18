# Rota Escolar

O Rota Escolar é um sistema para auxiliar uma escola de médio porte no controle do transporte escolar de crianças do 1º ao 5º ano do Ensino Fundamental.
O sistema tem como foco a organização das rotas e o controle dos alunos que utilizam o transporte, ajudando a evitar esquecimentos de pontos durante o percurso e facilitando o registro dos embarques.

## Sobre o projeto

Durante as rotas escolares, podem ocorrer situações como:

- Esquecer de passar em um ponto;
  
- Não saber quais alunos deveriam embarcar em cada ponto;
- Falta de controle sobre quais alunos utilizam determinada rota;
- Dificuldade para registrar quais alunos embarcaram.

O sistema permitirá que a escola organize as rotas e associe os alunos aos respectivos pontos de embarque.
O motorista poderá consultar sua rota e visualizar a lista de alunos que devem embarcar em cada ponto, registrando se o aluno embarcou ou não.

## Usuários do sistema
## 🏫 Escola

- Cadastrar alunos;
- Cadastrar motoristas;
- Criar e organizar rotas;
- Cadastrar pontos de embarque;
- Associar alunos às rotas;
- Consultar os alunos de cada rota.

## 🚌 Motorista

- Visualizar sua rota;
- Visualizar os pontos de embarque;
- Visualizar os alunos de cada ponto;
- Registrar o embarque do aluno;
- Registrar quando um aluno não embarcou.

## ⚙️ Principais funcionalidades
## 🗺️ Organização das rotas

A escola poderá cadastrar as rotas utilizadas pelo transporte escolar e definir seus pontos de embarque.

## 👧 Cadastro de alunos

A escola poderá cadastrar os alunos que utilizam o transporte escolar e associá-los a uma rota e a um ponto de embarque.

## 🚌 Controle de embarque

O motorista poderá visualizar os alunos previstos para cada ponto e registrar a situação do embarque.

## Objetivo
Facilitar a organização do transporte escolar, ajudando a escola e os motoristas a controlarem as rotas e os embarques dos alunos.        




### Atualização README



## ⚙️ Principais funcionalidades

### 🔐 Sistema de login

O sistema possui autenticação utilizando o Firebase Authentication.

Existem dois tipos de acesso:

- **Escola**
- **Motorista**

Cada usuário possui um perfil configurado no sistema. O motorista também é vinculado a uma rota específica.

# 🔑 Usuários de teste

Para acessar e testar o sistema, foram disponibilizados os seguintes usuários:

| Perfil | E-mail | Senha |
|---|---|---|
| 🏫 Escola | escola.teste@gmail.com 
| 🚌 Motorista — João | joao@gmail.com 
| 🚌 Motorista — Carlos | carlos@gmail.com 

## 🏫 Acesso da Escola

**E-mail:** `escola.teste@gmail.com`  

O usuário da Escola possui acesso às funcionalidades de gerenciamento do sistema, incluindo:

- Cadastro de alunos;
- Cadastro de motoristas;
- Cadastro de rotas;
- Cadastro de pontos de embarque;
- Associação de alunos às rotas;
- Associação de alunos aos pontos de embarque.

## 🚌 Acesso do Motorista — João

**E-mail:** `joao@gmail.com`  

O motorista João possui uma rota vinculada ao seu cadastro e pode:

- Visualizar sua rota;
- Visualizar os pontos de embarque;
- Visualizar os alunos de cada ponto;
- Registrar embarque;
- Registrar quando o aluno não embarcou.

## 🚌 Acesso do Motorista — Carlos

**E-mail:** `carlos@gmail.com`  

O motorista Carlos também possui acesso às funcionalidades destinadas ao motorista, conforme sua rota vinculada.



### 🗺️ Organização das rotas

A escola pode cadastrar as rotas utilizadas pelo transporte escolar e definir o motorista responsável.

Cada rota possui informações como:

- Nome da rota;
- Turno;
- Motorista responsável;
- Status da rota.

### 📍 Pontos de embarque

Os pontos de embarque podem ser cadastrados e organizados de acordo com a ordem do percurso.

### 👧 Cadastro e associação de alunos

A escola pode cadastrar os alunos e associá-los a:

- Uma rota;
- Um ponto de embarque.

Dessa forma, o motorista consegue identificar quais alunos devem embarcar em cada ponto.

### 🚌 Controle de embarque

O motorista pode consultar os alunos previstos para cada ponto e registrar a situação de cada aluno:

- Embarcou;
- Não embarcou.

## 🔥 Integração com Firebase

O sistema utiliza o Firebase para autenticação e armazenamento dos dados.

### Firebase Authentication

Responsável pelo login dos usuários.

### Firestore

Responsável pelo armazenamento das informações do sistema, incluindo:

- Usuários;
- Alunos;
- Motoristas;
- Rotas;
- Pontos de embarque;
- Registros de embarque.

## 🛠️ Tecnologias utilizadas

- HTML5;
- CSS;
- JavaScript;
- Firebase Authentication;
- Firestore;
- GitHub;
- Trello;
- Mermaid.js.

## 📁 Organização do projeto

O projeto possui arquivos separados de acordo com as principais funcionalidades:

- `index.html` — estrutura principal da aplicação;
- `style.css` — estilos da interface;
- `App.js` — controle da interface e funcionamento geral;
- `Firebase.js` — configuração e conexão com o Firebase;
- `Login.js` — autenticação dos usuários;
- `Alunos.js` — funções relacionadas aos alunos;
- `Motorista.js` — funções relacionadas aos motoristas;
- `Rotas.js` — funções relacionadas às rotas;
- `Pontos.js` — funções relacionadas aos pontos de embarque;
- `Embarques.js` — funções relacionadas aos registros de embarque.

A documentação do projeto também contém arquivos relacionados à modelagem e aos testes.

## 🧪 Testes realizados

Foram realizados testes das principais funcionalidades do sistema, incluindo:

- Login da Escola;
- Login do Motorista;
- Cadastro de alunos;
- Cadastro de motoristas;
- Cadastro de rotas;
- Cadastro de pontos;
- Associação de alunos;
- Consulta da rota pelo motorista;
- Consulta dos alunos por ponto;
- Registro de embarque;
- Logout;
- Integração com Firebase.


## 🔑 Como executar o projeto


O projeto está publicado no GitHub Pages e pode ser acessado diretamente pelo navegador.

### Execução online

1. Acesse o link do GitHub Pages: https://yasmindacosta101-commits.github.io/rota-escolar/
   [👉 Acessar o Rota Escolar]   
2. Aguarde o carregamento do sistema.
3. Faça login utilizando uma das contas de teste.
4. Após o login, o usuário terá acesso às funcionalidades de acordo com seu perfil.

### Execução local

Para executar o projeto localmente:

1. Baixe ou abra o repositório no computador.
2. Abra a pasta do projeto no Visual Studio Code.
3. Abra o arquivo `index.html` utilizando o Live Server.
4. O sistema será aberto no navegador.
5. Faça login com uma conta de teste.

Os dados do sistema são armazenados no Firebase, utilizando o Firebase Authentication e o Firestore.
