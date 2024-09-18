## TLDR;

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
                       aiplatform.googleapis.com \
                       --project=$MY_PROJECT_ID
```

If your project doesn't have a Docker Repo on Artifact Registry: 
```bash
gcloud artifacts repositories create docker-repo \
       --repository-format=docker \
       --location=$MY_LOCATION \
       --description="My Docker Repository" \
       --no-immutable-tags
``` 

If you haven't create the APIKEY secret:
```bash
gcloud secrets create apikey --replication-policy="automatic"
echo -n "a random generate 64 char string" | gcloud secrets versions add apikey --data-file=-

gcloud secrets add-iam-policy-binding apikey \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
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
       --role="roles/artifactregistry.admin" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/aiplatform.user" \
       --condition=None

```

Adjust substitutions on `cloudbuild.yaml` file:
```yaml
substitutions:
  _SERVICE_NAME: evaluator
  _SERVICE_REGION: southamerica-east1
  _TAG: 1.0.0
  _REPO_LOCATION: southamerica-east1
  _PROJECT_ID: gcp-project-id
  _REPO_ID: docker-repo
  _USER_AGENT: wiki-interface
```

Adjust your app config on `config/default.yaml` file:
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
  # en / br : Must match .txt file name
  language: en
grpc:
  retry: true
  max_retries: 15
  timeout: 60000
logging:
  format: combined
server:
  name: evaluator
```

Run cloud build to deploy:
```bash
gcloud builds submit . --config=./cloudbuild.yaml --region=$MY_LOCATION --project=$MY_PROJECT_ID
```
