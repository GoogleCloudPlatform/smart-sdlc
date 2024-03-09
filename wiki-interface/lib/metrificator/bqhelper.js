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

/**
 * wiki-interface
 * Interface com Gitlab Wiki
 * Details: BigQuery Integration
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */
const {BigQuery} = require('@google-cloud/bigquery');
const configHelper = require('../../lib/config/file');

/* Insert line in Metrics table */
async function insertMetric(row) {
    const bigquery = new BigQuery();

    /* Target details */
    let datasetId = configHelper.getDataset();
    let tableId = "ai_metrics";

    /* Checking if timestamp was provided */
    if(row.date == "") {
        row.date = new Date().toISOString();
    }

    const options = {
        // Specify a job configuration to set optional job resource properties.
        configuration: {
            query: {
                query: `INSERT INTO ${datasetId}.${tableId} 
                        VALUES('${row.id}','${row.date}','${row.project}','${row.user_story}','${row.document}','${row.model}')`,
                useLegacySql: false,
            },
            labels: {},
        },
    };
    
    // Make API request.
    const response = await bigquery.createJob(options);
    const job = response[0];
    
    // Wait for the query to finish
    const [rows] = await job.getQueryResults(job);

}

/* Insert line in Rating table */
async function insertRating(row) {
    const bigquery = new BigQuery();

    /* Target details */
    let datasetId = configHelper.getDataset();
    let tableId = "ai_rating";

    /* Checking if timestamp was provided */
    if(row.date == "") {
        row.date = new Date().toISOString();
    }

    const options = {
        // Specify a job configuration to set optional job resource properties.
        configuration: {
            query: {
                query: `INSERT INTO ${datasetId}.${tableId} 
                        VALUES('${row.id}',${row.rate})`,
                useLegacySql: false,
            },
            labels: {},
        },
    };
    
    // Make API request.
    const response = await bigquery.createJob(options);
    const job = response[0];
    
    // Wait for the query to finish
    const [rows] = await job.getQueryResults(job);

}

module.exports.insertMetric = insertMetric;
module.exports.insertRating = insertRating;