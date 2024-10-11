## TLDR;

**REVIEW** the `config/default.yaml` file:
```yaml
evaluator:
  url: https://evaluator-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
  sufix: "Eval"
generator:
  url: https://tc-generator-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
  sufix: "TestCase"
cypress:
  url: https://script-cypress-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
  sufix: "TS_Cypress"
playwright:
  url: https://script-playwright-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
  sufix: "TS_Playwright"
selenium:
  url: https://script-selenium-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
  sufix: "TS_Selenium"
data:
  url: https://test-data-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
image:
  url: https://image-processor-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
codesearch:
  url: https://code-search-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
solutionoverview:
  url: https://solution-overview-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
solutiondatabase:
  url: https://solution-database-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
solutionapi:
  url: https://api-overview-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
solutiondep:
  url: https://dependency-overview-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
solutionintegration:
  url: https://integration-overview-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
solutionsecurity:
  url: https://security-overview-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/process
gitlab:
  url: http://XXX-XXX-XXX-XXX.nip.io
  callback: https://wiki-interface-xxxxxxxxxxxx.xxxxxxxxxxxxxxx.run.app/gitlab/callback
  timeout: 60000
bigquery:
  dataset: metrificator
redis:
  url: redis://XXX.XXX.XXX.XXX:6379
ai:
  bucket: my-bucket-name
  workdir: /work
  project: gcp-project-id
  model: gemini-1.5-pro-001
  location: us-east1
  outputtokens: 8192
  temperature: 0.2
  chathistory: 6
main:
  # en / br : Must match _xx on templates
  language: en
logging:
  format: combined
server:
  name: wiki-interface
```

Export project values:
```bash
export MY_PROJECT_ID="gcp-project-id"
export MY_PROJECT_NO="1234567890"
export MY_LOCATION="southamerica-east1"
export MY_DATASET_ID="metrificator"
export MY_REDIS_ID="wiki-session"
export MY_PROJECT_VPC="my-vpc"
``` 

Set our project id:
```bash
gcloud config set project $MY_PROJECT_ID
```

Enable the following APIs: 
```bash
gcloud services enable cloudbuild.googleapis.com \
                       run.googleapis.com \
                       container.googleapis.com \
                       compute.googleapis.com \
                       artifactregistry.googleapis.com \
                       secretmanager.googleapis.com \
                       bigquery.googleapis.com \
                       redis.googleapis.com \
                       aiplatform.googleapis.com \
                       --project=$MY_PROJECT_ID
```

Create a Docker Repo on Artifact Registry: 
```bash
gcloud artifacts repositories create docker-repo \
       --repository-format=docker \
       --location=$MY_LOCATION \
       --description="My Docker Repository" \
       --no-immutable-tags
``` 

Create a secret to hold Git Authentication Token if you haven't already:
```bash
gcloud secrets create gittoken --replication-policy="automatic"
echo -n "this is Git Authentication Token" | gcloud secrets versions add gittoken --data-file=-

gcloud secrets add-iam-policy-binding gittoken \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
```

If you haven't create the APIKEY secret:
```bash
gcloud secrets create apikey --replication-policy="automatic"
echo -n "a random generate 64 char string" | gcloud secrets versions add apikey --data-file=-

gcloud secrets add-iam-policy-binding apikey \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
```

If you haven't create the SESSION_SECRET secret:
```bash
gcloud secrets create session-secret --replication-policy="automatic"
echo -n "a random generate 64 char string" | gcloud secrets versions add session-secret --data-file=-

gcloud secrets add-iam-policy-binding session-secret \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
```

If you haven't create the GITLAB_APP_ID secret:
```bash
gcloud secrets create gitlab-app-id --replication-policy="automatic"
echo -n "YOUR_GITLAB_APP_ID" | gcloud secrets versions add gitlab-app-id --data-file=-

gcloud secrets add-iam-policy-binding gitlab-app-id \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
```

If you haven't create the GITLAB_APP_SECRET secret:
```bash
gcloud secrets create gitlab-app-secret --replication-policy="automatic"
echo -n "YOUR_GITLAB_APP_SECRET" | gcloud secrets versions add gitlab-app-secret --data-file=-

gcloud secrets add-iam-policy-binding gitlab-app-secret \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"
```

Create a BigQuery Dataset:
```bash
bq mk \
   --location=$MY_LOCATION_ID \
   --description="Dataset to hold AI Metrics and Ratings" \
   --dataset $MY_PROJECT_ID:$MY_DATASET_ID 
```

Create a BigQuery Table:
```bash
cat metrificator.sql | envsubst > metrificator.$MY_PROJECT_ID.sql
bq query --use_legacy_sql=false < metrificator.$MY_PROJECT_ID.sql
```

Grant BigQuery Permissions:
```bash
gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/bigquery.dataOwner" \
       --condition=None

gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/bigquery.jobUser" \
       --condition=None
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

```

Create Redis instance:
```bash
gcloud redis instances create --project=$MY_PROJECT_ID \
       $MY_REDIS_ID --tier=basic --size=2 \
       --region=$MY_LOCATION \
       --redis-version=redis_7_0 \
       --network=projects/$MY_PROJECT_ID/global/networks/$MY_PROJECT_VPC \
       --connect-mode=DIRECT_PEERING
```

Grant Redis Permissions:
```bash
gcloud projects add-iam-policy-binding $MY_PROJECT_ID \
       --member="serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com" \
       --role="roles/redis.editor" \
       --condition=None
```

Adjust substitutions on `cloudbuild.yaml` file:
```yaml
substitutions:
  _SERVICE_NAME: wiki-interface
  _SERVICE_REGION: us-east1
  _TAG: 1.0.0
  _REPO_LOCATION: southamerica-east1
  _PROJECT_ID: gcp-project-id
  _REPO_ID: docker-repo
  _USER_AGENT: wiki-interface
  _VPC_NETWORK: vpc-name
  _VPC_SUBNET: subnet-name
```

Run cloud build to deploy:
```bash
gcloud builds submit . --config=./cloudbuild.yaml --region=$MY_LOCATION --project=$MY_PROJECT_ID
```

Add an external Wiki on **Gitlab** pointing to the **Cloud Run** URL `/webui/<project-id>`.  
