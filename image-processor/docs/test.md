# Teste

A aplicação pode ser invocada manualmente utilizando o **curl**.

## Ajustando o Ambiente

Primeiramente é necessário ajustar o ambiente para poder popular os *headers* do request:

```bash
export APIKEY="random generated api key"
export USER_AGENT="wiki-interface"
```

## Fazendo a Chamada

Considerando que o arquivo de entrada é `input.json` e está formatado em *JSON*, o comando para fazer a chamada manualmente é:

```bash
curl --user-agent "${USER_AGENT}" \
     --request POST  \
     --data @input.json \
     --header "API_KEY: ${APIKEY}" \
     --header "Content-Type: application/json" \
     http://my-supper-fancy-url/process
```