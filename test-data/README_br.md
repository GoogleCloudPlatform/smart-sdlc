# test-data

Aplicação/Serviço em NodeJS + Express para gerar massa de dados a partir de um exemplo.  
Esta aplicação foi concebida para executar em Docker no **Google Cloud Run**.  
O **Vertex AI** do Google Cloud é utilizado para esta implementação.

## Variáveis de Ambiente

A aplicação depende das seguintes variáveis de ambiente para execução:

```bash
export PORT=8080
export APIKEY="random generated api key"
export PROJECT_ID="gcp-project-id"
export USER_AGENT="string to look for in user agent header"
```

*Nota:* APIKEY pode ser gerada com uma string de 64 caracteres em `https://pinetools.com/random-string-generator`

## Configuração

A aplicação utiliza o arquivo `config/default.yaml` para configuração:

```yaml
aiplatform:
  location: us-east1
  # gemini-1.0-pro-001 / gemini-1.5-flash-001 / gemini-1.5-pro-001
  model: gemini-1.5-pro-001
  temperature: 0.6
  maxtokens: 8192
  keepalive_timeout: 30000
  keepalive_time: 10000
  enable_retries: 1
  dns_min_time_between_resolutions_ms: 10000
  initial_reconnect_backoff_ms: 10000
  max_reconnect_backoff_ms: 60000
  client_idle_timeout_ms: 60000
  # en / br : Must match *_XX.txt file name
  language: en
grpc:
  retry: true
  max_retries: 15
  timeout: 60000
logging:
  format: combined
server:
  name: test-data
```

## Prompt

O prompt enviado para a plataforma do **Vertex AI** é lido do arquivo `config/prompt_XX.txt`.  
*Nota:* O prompt serve como uma configuração para o **Vertex AI**.

## Build

O build local pode ser feito da seguinte maneira:

```bash
export PROJECT_ID="gcp-project-id"
export REPOSITORY_LOCATION="southamerica-east1"
export REPOSITORY_ID="docker-repo"
export TAG="1.0.0"
docker build -t ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/test-data/test-data:${TAG} .
docker push ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/test-data/test-data:${TAG}
```

## Deploy

O deploy pode ser feito da seguinte maneira:

```bash
export PROJECT_ID="gcp-project-id"
export REPOSITORY_LOCATION="artifact registry repository location"
export REPOSITORY_ID="artifact registry repository id"
export CLOUDRUN_LOCATION="southamerica-east1"
export TAG="1.0.0"
gcloud run deploy test-data --image ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/test-data/test-data:${TAG} --region ${CLOUDRUN_LOCATION} --project ${PROJECT_ID} --allow-unauthenticated

```

## Google Cloud

O CLI/SDK do Google Cloud pode ser configurado da seguinte forma:

```bash
gcloud auth login
gcloud config set project gcp-project-id
gcloud auth configure-docker us-central1-docker.pkg.dev,southamerica-east1-docker.pkg.dev
```

## Executando Localmente

Para executar localmente:

```bash
export PORT=8080
export APIKEY="random generated api key"
export PROJECT_ID="gcp-project-id"
export USER_AGENT="string to look for in user agent header"

npm install

npm start
```