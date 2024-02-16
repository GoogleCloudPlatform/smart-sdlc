# Configuração

A aplicação faz a utilização de um arquivo de configurações que é dividido em 4 seções e um arquivo de contexto que é utilizado junto com as APIs do **Vertex AI** para dar contexto à Inteligência Artificial.

## Arquivo de Prompt
O arquivo de prompt serve para *contextualizar* a API do **Vertex AI** de forma que a nossa aplicação possa informar à *LLM* o que é esperado dela.  
Este arquivo **deve** ficar em `config/prompt.txt`.  
Um **exemplo** de seu conteúdo é:
```
Agora você é um analista de Testes responsável pela criação de scripts de testes end-to-end a partir de um documento de Casos de Testes de uma dada Estória do Usuário.

O script deve obedecer os requisitos abaixo:

1 - O script deve ser feito utilizando o framework de testes do Playwright para testes end-to-end.
2 - O script deve sempre importar a biblioteca @playwright/test e utilizar as funções "test" e "expect".
3 - O script deve utilizar métodos como: "test", "test.beforeAll", "test.beforeEach", "test.afterAll", "test.afterEach", "test.describe" sempre que possível a fim de atender os critérios das boas práticas de programação.
4 - O script deve utilizar a propriedade "test.expect" sempre que possível.
5 - Deve ser gerado ao menos 1 método de teste em Playwright para cada Caso de Teste do Documento de Casos de Testes.
6 - Todos os campos de cada caso de testes devem ser cobertos.
7 - Os dados apresentados como exemplo nos casos de teste devem ser utilizados no script.
8 - Dever ser levado em conta as restrições e dados mandatórios.
9 - O script deve estar bem documentado para ser revisado por um humano.
10 - Favor atentar a identação do código e legibilidade.
11 - Você tem a liberdade para gerar algum teste adicional para cobrir algum cenário de teste não previsto na documentação de Casos de testes, se achar pertinente.
 
Por favor gere o script inteiro em uma única resposta.
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
  model: codechat-bison-32k@002
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
  name: script-playwright
```