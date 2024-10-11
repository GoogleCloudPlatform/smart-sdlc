/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* METRICS TABLE */
CREATE TABLE `$MY_DATASET_ID`.ai_metrics (
  id STRING NOT NULL OPTIONS (description = 'UUID of Document'),
  gitlab_user STRING NOT NULL OPTIONS (description = 'Gitlab User'),
  date TIMESTAMP NOT NULL OPTIONS (description = 'Timestamp document was generate'),
  project STRING NOT NULL OPTIONS (description = 'Wiki Project Id'),
  input_doc STRING NOT NULL OPTIONS (description = 'Input Document'),
  document STRING NOT NULL OPTIONS (description = 'Document Name'),
  model STRING NOT NULL OPTIONS (description = 'AI Model')
);

/* RATING TABLE */
CREATE TABLE `$MY_DATASET_ID`.ai_rating (
  id STRING NOT NULL OPTIONS (description = 'UUID of Document'),
  rating INT64 NOT NULL OPTIONS (description = 'Rate of the Document')
);

/* METRICS PK */
ALTER TABLE `$MY_DATASET_ID`.ai_metrics
ADD PRIMARY KEY (id) NOT ENFORCED;

/* RATING FK */
ALTER TABLE `$MY_DATASET_ID`.ai_rating
ADD CONSTRAINT fk_to_metrics FOREIGN KEY (id)
REFERENCES `$MY_DATASET_ID`.ai_metrics(id) NOT ENFORCED;

/* GRANT TO CLOUD RUN */
GRANT `roles/bigquery.dataOwner`
ON SCHEMA `$MY_PROJECT_ID`.`$MY_DATASET_ID`
TO "serviceAccount:$MY_PROJECT_NO-compute@developer.gserviceaccount.com"