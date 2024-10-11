# Build

Existem duas maneiras de fazer o *build* da aplicação.

## Localmente
Para construir a aplicação localmente, é necessário garantir que o **NodeJS 18** e o **NPM** está instalado.  
Após a instalação dos requisitos necessários:
```bash
npm run clean
npm install
```

## Docker / Containerd
É necessário fazer a autenticação do sistema de containers com o repositório:
```bash
gcloud auth login
gcloud config set project gcp-project-id
gcloud auth configure-docker us-central1-docker.pkg.dev,southamerica-east1-docker.pkg.dev
```

Para a construir a aplicação usando **containers**:
```bash
export PROJECT_ID="gcp-project-id"
export REPOSITORY_LOCATION="artifact registry repository location"
export REPOSITORY_ID="artifact registry repository id"
export TAG="1.0.0"
docker build -t ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/api-overview/api-overview:${TAG} .
docker push ${REPOSITORY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_ID}/api-overview/api-overview:${TAG}
```