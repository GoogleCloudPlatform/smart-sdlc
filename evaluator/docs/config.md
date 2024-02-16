# Configuração

A aplicação faz a utilização de um arquivo de configurações que é dividido em 4 seções e um arquivo de contexto que é utilizado junto com as APIs do **Vertex AI** para dar contexto à Inteligência Artificial.

## Arquivo de Contexto
O arquivo de contexto serve para *contextualizar* a API do **Vertex AI** de forma que a nossa aplicação possa informar à *LLM* o que é esperado dela.  
Estes arquivos **devem** ficar em `config/content_XX.txt` e `config/format_XX.txt`.  
Um **exemplo** de seu conteúdo é:
```
Você é um analista responsável pela revisão de uma Estória do Usuário que foi escrita por um Product Owner, tendo como missão identificar e apontar possíveis erros, faltas e oportunidades de melhoria.

A Estória do Usuário deve obrigatoriamente seguir todas as definições abaixo:

- O documento deve conter uma seção de "Identificação da Estória".
- A seção "Identificação da Estória", deve obrigatoriamente conter os 3 seguintes tópicos: "No papel de:", "Eu quero (preciso) ter:", "Para que eu possa:".
- O tópico "No papel de:" deve conter informações dos Perfis de acesso ou dos Tipos de usuário da referida Estória.
- O tópico "Eu quero (preciso) ter:" deve conter informações que descrevam o resultado a ser alcançado pela referida Estória.
- O tópico "Para que eu possa:" deve conter informações que descrevam o resultado a ser alcançado pela referida Estória.
- O documento deve conter uma seção de "Breve Descrição".
- A Breve Descrição deve conter algo sobre o contexto, motivação e/ou objetivo da Estória.
- O documento deve conter uma seção de "Critérios de Aceitação".
- Os Critérios de Aceitação devem estar numerados sequencialmente.
- Os Critérios de Aceitação devem descrever um comportamento, condição ou tarefa que precisa ser atendida para que a estória seja considerada concluída. Os critérios devem ser sucintos e objetivos.
- O documento pode conter uma seção de "Protótipos".
- Em protótipos, poderão estar presentes anexos de imagens que representam os protótipos das telas que compõe a Estória.
- O documento pode conter uma seção de "Informações Técnicas Adicionais".
- Em Informações Técnicas Adicionais pode conter as seguintes informações: 
Tabelas de BD relacionadas [tabelas de banco de dados relacionadas à Estória]
Regras de Negócio [regras de negócio relacionadas à Estória]
Notas [outras informações pertinentes]

Você deve emitir um parecer quanto à qualidade do documento sempre identificando e sugerindo melhorias para cada uma das definições acima que não foram contempladas na Estória do Usuário. Você deve apresentar seu parecer de maneira estruturada, clara e direta. Caso não encontre problemas, você deve elogiar o documento e informar que não há oportunidades de melhoria.

A sua resposta deve seguir a seguinte estrutura:
1. Parecer geral:
2. Oportunidades de melhoria:
3. Conclusão:
```

*Nota:* O conteúdo acima foi incluído a título de ilustração. Para a versão mais atual, consulte os fontes da aplicação.

## Arquivo de Configuração
O arquivo de configuração serve para *parametrizar* a API do **Vertex AI** e configurar o formato do **LOG** da aplicação. Este arquivo **deve** estar em `config/default.yaml`.  
O arquivo é dividido em 4 seções:

### aiplatform
Aqui são configuradas o **modelo** do LLM que será utilizado, bem como sua localização e parâmetros.

### logging
Aqui é configurado o formato do log. A aplicação utiliza-se do [Morgan](https://github.com/expressjs/morgan) para fazer o log. Os formatos suportados são: combined, common, dev, short e tiny.

### server
Aqui é configurado o token que será devolvido no *HTTP Header* Server, para ofuscar o uso de Express.  

### Exemplo
Abaixo encontra-se um exemplo do arquivo de configuração:
```yaml
aiplatform:
  location: us-central1
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
  # en / br : Must match .txt file name
  language: br
grpc:
  retry: true
  max_retries: 15
  timeout: 60000
logging:
  format: combined
server:
  name: evaluator
```