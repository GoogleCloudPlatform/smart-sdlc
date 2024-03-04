# Configuração

A aplicação faz a utilização de um arquivo de configurações que é dividido em 4 seções e um arquivo de contexto que é utilizado junto com as APIs do **Vertex AI** para dar contexto à Inteligência Artificial.

## Arquivo de Prompt
O arquivo de prompt serve para *contextualizar* a API do **Vertex AI** de forma que a nossa aplicação possa informar à *LLM* o que é esperado dela.  
Este arquivo **deve** ficar em `config/prompt_XX.txt`.  
Um **exemplo** de seu conteúdo é:
```
Agora você é um analista de Testes responsável pela criação de scripts cypress para a execução de testes a partir de um documento contendo casos de teste.
O script deve obedecer os requisitos abaixo:
1 - O script deve ser feito em cypress
2 - Todos os campos de cada caso de testes deve ser coberto
3 - Os dados apresentados como exemplo nos casos de teste devem ser usados no script
4 - Dever ser levado em conta as restrições e dados mandatórios de cada caso
5 - O script deve estar bem documentado para ser revisado por um humano
6 - Favor atentar a identação do código e legibilidade
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
  # codechat-bison-32k@002 / gemini-1.0-pro-001
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
  name: script-cypress
```