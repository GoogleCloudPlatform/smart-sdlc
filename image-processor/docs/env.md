# Variáveis de Ambiente

A aplicação depende de algumas variáveis de ambiente para execução com sucesso.

## Porta do serviço
Esta aplicação foi concebida para ser executada dentro do **Google Cloud Run**. Um dos requisitos desta plataforma é que a porta do serviço seja configurada através da variável de ambiente **PORT**.  
Por default utilizamos a porta *8080*:
```bash
PORT=8080
```

## Projeto Google Cloud
Uma vez que a aplicação foi concebida para ser executada dentro do **Google Cloud Run** e que a aplicação tambem faz uso do **Vertex AI**, é necessario indicar projeto da plataforma **Google Cloud** que hospedará tanto a aplicação como a API do **Vertex AI**:
```bash
PROJECT_ID="gcp-project-id"
```

## Controle de Autenticação e Autorização
Os controles de autenticação e autorização é feito através de *headers* do protocolo **HTTP**. Para autenticar a requisição, à aplicação precisa enviar o *header* **api_key** que será comparado com o valor indicado na variável de ambiente **APIKEY**.  
Já para a autorização, utilizamos o *header* **User-Agent**, que por sua vez é comparado com a variável de ambiente **USER_AGENT**, onde neste caso em específico, buscamos se o valor contido na variável de ambiente é uma **substring** do valor enviado no *header*.

```bash
APIKEY="random generated api key"
USER_AGENT="string to look for in user agent header"
```

O valor de **APIKEY** deve ser uma string de 64 caracteres. A mesma pode ser gerada randomicamente utilizando um gerador qualquer, como por exemplo: https://pinetools.com/random-string-generator

O valor de **USER_AGENT** deve conter uma *string* que será verificada contra o *header* **User-Agent** das chamadas. Um exemplo pode ser: *qa-wiki-interface*
