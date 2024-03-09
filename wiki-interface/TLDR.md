## TLDR;

**REVIEW** the `config/default.yaml` file:
```
evaluator:
  url: https://evaluator-xxxxxxxxxxxxxxx.app/process
  sufix: "Eval"
generator:
  url: https://tc-generator-xxxxxxxxxxxxxxx.app/process
  sufix: "TestCase"
cypress:
  url: https://script-cypress-xxxxxxxxxxxxxxx.app/process
  sufix: "TS_Cypress"
playwright:
  url: https://script-playwright-xxxxxxxxxxxxxxx.app/process
  sufix: "TS_Playwright"
gitlab:
  url: http://XXX-XXX-XXX-XXX.nip.io
  timeout: 60000
bigquery:
  dataset: metrificator
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
                       --project=$MY_PROJECT_ID
```

Create a Docker Repo on Artifact Registry: 
```bash
gcloud artifacts repositories create docker-repo \
       --repository-format=docker \
       --location=$MY_LOCATION \
       --description="My Docker Repository"
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

Adjust substitutions on `cloudbuild.yaml` file:
```yaml
substitutions:
  _SERVICE_NAME: wiki-interface
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

Add an external Wiki on **Gitlab** pointing to the **Cloud Run** URL `/webui/<project-id>`.  
