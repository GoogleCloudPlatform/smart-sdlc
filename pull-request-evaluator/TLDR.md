## TLDR;

**REVIEW** the `config/default.yaml` file:
```yaml
aitext:
  location: us-central1
  model: text-bison-32k@002
  temperature: 0.2
  maxtokens: 8192
  keepalive_timeout: 30000
  keepalive_time: 8000
  enable_retries: 1
  dns_min_time_between_resolutions_ms: 10000
  initial_reconnect_backoff_ms: 10000
  max_reconnect_backoff_ms: 60000
  client_idle_timeout_ms: 60000
aicode:
  location: us-central1
  model: codechat-bison-32k@002
  temperature: 0.2
  maxtokens: 8192
  keepalive_timeout: 30000
  keepalive_time: 10000
  enable_retries: 1
  dns_min_time_between_resolutions_ms: 10000
  initial_reconnect_backoff_ms: 10000
  max_reconnect_backoff_ms: 60000
  client_idle_timeout_ms: 60000
grpc:
  retry: true
  max_retries: 15
  timeout: 60000
git:
  type: github
github:
  timeout: 60000
  throttle: true
  retry: true
gitlab:
  url: http://123-123-123-123.nip.io
  timeout: 60000
functions:
  # en / br : Must match prompt_XX.txt file name
  language: en
  prsummary: true
  diffsummary: true
  diffrank: true
  filesummary: true
  fileperformance: true
  filesecurity: true
logging:
  format: combined
server:
  name: pull-request-evaluator
```

Export project values:
```bash
export MY_PROJECT_ID="gcp-project-id"
export MY_PROJECT_NO="1234567890"
export MY_LOCATION="southamerica-east1"
``` 

Enable the following APIs: 
```bash
gcloud services enable cloudbuild.googleapis.com \
                       run.googleapis.com \
                       container.googleapis.com \
                       compute.googleapis.com \
                       artifactregistry.googleapis.com \
                       secretmanager.googleapis.com \
                       --project=$MY_PROJECT_ID
```

Create a Docker Repo on Artifact Registry: 
```bash
gcloud artifacts repositories create docker-repo \
       --repository-format=docker \
       --location=$MY_LOCATION \
       --description="My Docker Repository"
``` 

Create a secret to hold Git Webhook Secret:
```bash
gcloud secrets create gitwebhook --replication-policy="automatic"
echo -n "this is the Git Webhook Secret" | gcloud secrets versions add gitwebhook --data-file=-
```

Create a secret to hold Git Authentication Token:
```bash
gcloud secrets create gittoken --replication-policy="automatic"
echo -n "this is Git Authentication Token" | gcloud secrets versions add gittoken --data-file=-
```

Grant a few IAM permissions:
```bash
gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/container.developer" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/iam.serviceAccountUser" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/run.admin" \
       --condition=None	

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO@cloudbuild.gserviceaccount.com" \
       --role="roles/artifactregistry.admin" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/aiplatform.user" \
       --condition=None

gcloud secrets add-iam-policy-binding gitwebhook \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding gittoken \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
```

Adjust substitutions on `cloudbuild.yaml` file:
```yaml
substitutions:
  _SERVICE_NAME: pull-request-evaluator
  _SERVICE_REGION: southamerica-east1
  _TAG: 1.0.0
  _REPO_LOCATION: southamerica-east1
  _PROJECT_ID: gcp-project-id
  _REPO_ID: docker-repo
```

Run cloud build to deploy:
```bash
gcloud builds submit . --config=./cloudbuild.yaml --region=$MY_LOCATION --project=$MY_PROJECT_ID
```

Point your Git Webhook call to the **Cloud Run** URL `/webhook`.  
Don´t forget that you need to use the same **WEBHOOK SECRET** otherwise the call will not be authorized.