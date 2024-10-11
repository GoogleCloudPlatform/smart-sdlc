# security-overview

App/Service in NodeJS + Express to generate Security Overview document.  
This application is designed to run in Docker on **Google Cloud Run**.  
Google Cloud's **Vertex AI** is used in the implementation.

## TLDR
For those in a rush, head to [TLDR.md](TLDR.md) file.

## Variables and Environment

This app relies on the following environment variables to execute:

```bash
export PORT=8080
export APIKEY="random generated api key"
export PROJECT_ID="gcp-project-id"
export USER_AGENT="string to look for in user agent header"
```

*Note:* APIKEY should be 64 random char string.

## Config

The app uses file `config/default.yaml` as its config file:

```yaml
aiplatform:
  location: us-east1
   # gemini-1.0-pro-001 / gemini-1.5-flash-001 / gemini-1.5-pro-001
  model: gemini-1.5-pro-001
  temperature: 0.2
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
  name: security-overview
```

## Prompt

The prompts that are sent to **Vertex AI** are present on the following files `config/*_XX.txt`.  
*Note:* The prompt works as a config file for **Vertex AI**.

## Build

The local build can be performed by following the steps below:

```bash
export PROJECT_ID="gcp-project-id"
export REPOSITORY_LOCATION="southamerica-east1"
export REPOSITORY_ID="docker-repo"
export TAG="1.0.0"
docker build -t ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/security-overview/security-overview:${TAG} .
docker push ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/security-overview/security-overview:${TAG}
```

## Deploy

To deploy the app follow the steps:

```bash
export PROJECT_ID="gcp-project-id"
export REPOSITORY_LOCATION="artifact registry repository location"
export REPOSITORY_ID="artifact registry repository id"
export CLOUDRUN_LOCATION="southamerica-east1"
export TAG="1.0.0"
gcloud run deploy security-overview --image ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/security-overview/security-overview:${TAG} --region ${CLOUDRUN_LOCATION} --project ${PROJECT_ID} --allow-unauthenticated

```

## Google Cloud

Google Cloud's CLI/SDK can be set up as the example:

```bash
gcloud auth login
gcloud config set project gcp-project-id
gcloud auth configure-docker us-central1-docker.pkg.dev,southamerica-east1-docker.pkg.dev
```

## Running locally

To run locally:

```bash
export PORT=8080
export APIKEY="random generated api key"
export PROJECT_ID="gcp-project-id"
export USER_AGENT="string to look for in user agent header"

npm install

npm start
```