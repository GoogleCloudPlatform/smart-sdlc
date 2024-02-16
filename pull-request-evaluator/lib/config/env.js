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
 * pull-request-evaluator
 * Pull Request Evaluator
 * Details: Handle Environment Variables
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

function checkEnvironment() {
    /* Check if WEBHOOK_SECRET is setup as ENV */
    if (!process.env.WEBHOOK_SECRET) {
        console.log("No WEBHOOK_SECRET set");
        return false;
    }

    /* Check if GIT_TOKEN is setup as ENV */
    if (!process.env.GIT_TOKEN) {
        console.log("No GIT_TOKEN set");
        return false;
    }

    /* Check if Project is setup as ENV */
    if (!process.env.PROJECT_ID) {
        console.log("Please set PROJECT_ID value");
        return false;
    }

    return true;
}

/* Return Webhook Secret */
function getWebhookSecret() {
    let secret = process.env.WEBHOOK_SECRET || "";
    return secret;
}

/* Return Git Access Token */
function getGitToken() {
    let token = process.env.GIT_TOKEN || "";
    return token;
}

/* GCP Project ID */
function getProject() {
    let project = process.env.PROJECT_ID || "";
    return project;
}


module.exports.getWebhookSecret = getWebhookSecret;
module.exports.getGitToken = getGitToken;
module.exports.checkEnvironment = checkEnvironment;
module.exports.getProject = getProject;