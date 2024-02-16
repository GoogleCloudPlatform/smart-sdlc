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
 * script-cypress
 * Gerador de Documento de Testes Cypress
 * Details: Handle Environment Variables
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

function checkEnvironment() {
    /* Check if APIKEY is setup as ENV */
    if (!process.env.APIKEY) {
        console.log("No APIKEY set");
        return false;
    }

    /* Check if Project is setup as ENV */
    if (!process.env.PROJECT_ID) {
        console.log("Please set PROJECT_ID value");
        return false;
    }

    /* Check if USER_AGENT is setup as ENV */
    if (!process.env.USER_AGENT) {
        console.log("Please set USER_AGENT value");
        return false;
    }
    return true;
}

function getProject() {
    let project = process.env.PROJECT_ID || "";
    return project;
}

function getApikey() {
    let apikey = process.env.APIKEY || "";
    return apikey;
}

function getUseragent() {
    let useragent = process.env.USER_AGENT || "";
    return useragent;
}

module.exports.getProject = getProject;
module.exports.getApikey = getApikey;
module.exports.getUseragent = getUseragent;
module.exports.checkEnvironment = checkEnvironment;