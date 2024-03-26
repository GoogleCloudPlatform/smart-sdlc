# Configuração

A aplicação faz a utilização de um arquivo de configurações que é dividido em 4 seções e um arquivo de contexto que é utilizado junto com as APIs do **Vertex AI** para dar contexto à Inteligência Artificial.

## Arquivo de Prompt
O arquivo de prompt serve para *contextualizar* a API do **Vertex AI** de forma que a nossa aplicação possa informar à *LLM* o que é esperado dela.  
Este arquivo **deve** ficar em `config/prompt_XX.txt`.  
Um **exemplo** de seu conteúdo é:
```
Por favor, descreva detalhadamente a tela apresentada na imagem.
Lembre-se, voce só deve incluir em sua descrição os campos que estão presentes na imagem.
Sua descrição não deve conter nenhum componente que não esteja presenta na imagem.
Se houverem campos, inclua em sua descrição o tipo e dado de cada um dos campos.
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
  # gemini-1.0-pro-vision-001
  model: gemini-1.0-pro-vision-001
  temperature: 0.2
  maxtokens: 2048
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