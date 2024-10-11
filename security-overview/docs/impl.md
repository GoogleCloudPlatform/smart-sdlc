# Implementação

Este documento apresenta alguns detalhes sobre a implementação da solução.

## Geral
A aplicação foi escrita em **NodeJS** utilizando frameworks como **Express**, **Morgan** e **Google Cloud AI Platform**. A idéia é que a aplicação execute em um *container*.

## lib
O projeto foi organizado de forma a tentar manter uma divisão de *responsabilidades* entre os múltiplos componentes.  
Hoje temos 3 grandes grupos de *responsabilidade*: 

### config
* ctx.js: Responsável por trabalhar com os arquivos `config/*_XX.txt`.
* file.js: Responsável por trabalhar com o arquivo `config/default.yml`.
* env.js: Responsável por trabalhar com variáveis de ambiente.


### security
* authentication.js: Middleware que confere o valor do *header* API_KEY
* authorization.js: Middleware que confere o valor do *header* User-Agent
* obfuscator.js: Middleware para alterar o valor do *header* Server

### gcp
* geminihelper.js: Responsável por invocar o **Vertex AI** usando **gemini-pro**.

## index.js
Arquivo principal da solução. A lógica de implementação é a sequinte:
1. Importar pacotes gerais do NodeJS
2. Importar as dependências locais do `lib`
3. Checagem de **arquivo de configuração**, **variáveis de ambiente** e **arquivo de contexto**
4. Criação da aplicação **Express**
5. Configuração do **Morgan** para logs
6. Configuração do *middleare* para ofuscar a versão do Express
7. Configuração dos *middlewares* incluindo **Autenticação** e **Autorização**
8. Implementação de um Health Check
9. Implementação do endpoint que vai invocar o **Vertex AI**
10. Inicialização do Servidor