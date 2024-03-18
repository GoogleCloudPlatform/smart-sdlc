# Configuração

A aplicação faz a utilização de um arquivo de configurações que é dividido em 4 seções e um arquivo de contexto que é utilizado junto com as APIs do **Vertex AI** para dar contexto à Inteligência Artificial.

## Arquivo de Prompt
O arquivo de prompt serve para *contextualizar* a API do **Vertex AI** de forma que a nossa aplicação possa informar à *LLM* o que é esperado dela.  
Este arquivo **deve** ficar em `config/prompt_XX.txt`.  
Um **exemplo** de seu conteúdo é:
```
Voce agora é um analista de testes responsável por criar dados de testes para que outro analista possa realizar testes funcionais em uma aplicação.
Abaixo será apresentado um arquivo CSV onde a primeira linha apresenta o nome dos campos, e a segunda linha uma entrada de exemplo.
Voce deve gerar 10 registros seguindo o padrão do arquivo CSV.
Caso haja algum campo de senha, favor utilizar ao menos 8 caracteres, sendo ao menos 1 letra maiúscula, 1 letra minúscula e um numeral e um caracter especial.
O resultado deve ser apresentado em CSV, uma entrada por linha, sem utilizar Markdown.
Delimite todos os campos com do CSV com aspas duplas
Lembre-se, voce deve gerar 10 linhas!
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
  model: gemini-1.0-pro-001
  temperature: 0.6
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
  name: test-data
```