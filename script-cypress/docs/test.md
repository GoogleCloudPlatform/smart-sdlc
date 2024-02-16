# Teste

A aplicação pode ser invocada manualmente utilizando o **curl**.

## Ajustando o Ambiente

Primeiramente é necessário ajustar o ambiente para poder popular os *headers* do request:

```bash
export APIKEY="random generated api key"
export USER_AGENT="wiki-interface"
```

## Fazendo a Chamada

Considerando que o arquivo de entrada é `entrada.md` e está formatado em *Markdown*, o comando para fazer a chamada manualmente é:

```bash
curl --user-agent "${USER_AGENT}" \
     --request POST  \
     --data @entrada.md \
     --header "API_KEY: ${APIKEY}" \
     --header "Content-Type: text/markdown" \
     https://my-supper-fancy-url/process
```