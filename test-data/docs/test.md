# Teste

A aplicação pode ser invocada manualmente utilizando o **curl**.

## Ajustando o Ambiente

Primeiramente é necessário ajustar o ambiente para poder popular os *headers* do request:

```bash
export APIKEY="random generated api key"
export USER_AGENT="wiki-interface"
```

## Fazendo a Chamada

Considerando que o arquivo de entrada é `input.csv` e está formatado em *CSV*, o comando para fazer a chamada manualmente é:

```bash
curl --user-agent "${USER_AGENT}" \
     --request POST  \
     --data @input.csv \
     --header "API_KEY: ${APIKEY}" \
     --header "Content-Type: text/markdown" \
     https://my-supper-fancy-url/process/10
```

*Nota: 10 é o numero de registros a ser gerado*