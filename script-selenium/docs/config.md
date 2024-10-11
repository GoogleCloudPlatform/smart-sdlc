# Configuração

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
  location: us-east1
  # gemini-1.0-pro-001 / gemini-1.5-flash-001 / gemini-1.5-pro-001
  model: gemini-1.5-pro-001
  temperature: 0.3
  maxtokens: 8192
  keepalive_timeout: 30000
  keepalive_time: 10000
  enable_retries: 1
  dns_min_time_between_resolutions_ms: 10000
  initial_reconnect_backoff_ms: 10000
  max_reconnect_backoff_ms: 60000
  client_idle_timeout_ms: 60000
  # en / br : Must match prompt_XX.txt file name
  language: en
grpc:
  retry: true
  max_retries: 15
  timeout: 60000
logging:
  format: combined
server:
  name: script-selenium
```