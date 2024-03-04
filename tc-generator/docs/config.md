# Configuração

A aplicação faz a utilização de um arquivo de configurações que é dividido em 4 seções e um arquivo de contexto que é utilizado junto com as APIs do **Vertex AI** para dar contexto à Inteligência Artificial.

## Arquivo de Prompt
O arquivo de prompt serve para *contextualizar* a API do **Vertex AI** de forma que a nossa aplicação possa informar à *LLM* o que é esperado dela.  
Este arquivo **deve** ficar em `config/prompt_XX.txt`.  
Um **exemplo** de seu conteúdo é:
```
Agora você é um analista de Testes responsável pela criação de planos de testes de aplicações à partir de docume
ntos de Estória de Usuário.


Para cada estória de usuário voce precisa criar um documento de plano de testes contendo casos de testes para a Estória obedece
ndo os requisitos:
1 - O documento gerado deve estar em Markdown
2 - O maior número possível de casos de testes deve ser gerado para cobrir toda a estória que está sendo analisada.
3 - Cada caso de testes deve conter um passo a passo da execução do plano de teste
4 - O passo a passo deve conter dados de exemplo para serem usados na execução do caso em questão
5 - Para cada caso de teste gerado, caso existam dados que são mandatórios, identificar os mesmos
6 - Para cada caso de teste gerado, caso existam restrições referentes à dados ou formatação dos dados, identificar as mesmas
7 - Cada caso de teste deve conter também informações sobre o resultado esperado
8 - Considerar todos os dados e campos que estão presentes na estória para a elaboração do resultado esperado
9 - Por favor organizar cada caso de testes de forma separada com o passo a passo detalhado referente ao caso em questão
10 - O resultado todo deve ser apresentado de uma única vez em sua resposta, contendo todos os casos de testes possíveis
```

*Nota:* O conteúdo acima foi incluído a título de ilustração. Para a versão mais atual, consulte os fontes da aplicação.

## Arquivo de Configuração
O arquivo de configuração serve para *parametrizar* a API do **Vertex AI** e configurar o formato do **LOG** da aplicação. Este arquivo **deve** estar em `config/default.yaml`.  
O arquivo é dividido em 4 seções:

### aiplatform
Aqui são configuradas o **modelo** do LLM que será utilizado, bem como sua localização e parâmetros.

### logging
Aqui é configurado o formato do log. A aplicação utiliza-se do [Morgan](https://github.com/expressjs/morgan) para fazer o log. Os formatos suportados são: combined, common, dev, short e tiny.

### grpc
Aqui é configurado o tempo de timeout da chamada do **Vertex AI** bem como parâmetros de retry.

### server
Aqui é configurado o token que será devolvido no *HTTP Header* Server, para ofuscar o uso de Express.  

### Exemplo
Abaixo encontra-se um exemplo do arquivo de configuração:
```yaml
aiplatform:
  location: us-central1
  # chat-bison-32k@002 / text-bison-32k@002 / gemini-1.0-pro-001
  model: chat-bison-32k@002
  temperature: 0.2
  maxtokens: 8192
  keepalive_timeout: 30000
  keepalive_time: 10000
  enable_retries: 1
  dns_min_time_between_resolutions_ms: 10000
  initial_reconnect_backoff_ms: 10000
  max_reconnect_backoff_ms: 60000
  client_idle_timeout_ms: 60000
  # en / br : Must match prompt_XX.txt file name
  language: br
grpc:
  retry: true
  max_retries: 15
  timeout: 60000
logging:
  format: combined
server:
  name: tc-generator
```