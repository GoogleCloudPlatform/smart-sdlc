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

function checkEnvironment() {
    /* Check if API KEY is setup as ENV */
    if (!process.env.APIKEY) {
        console.log("No APIKEY set");
        return false;
    }

    /* Check if GIT_TOKEN is setup as ENV */
    if (!process.env.GIT_TOKEN) {
        console.log("Please set GIT_TOKEN value");
        return false;
    }

    /* Check if GITLAB_APP_ID is setup as ENV */
    if (!process.env.GITLAB_APP_ID) {
        console.log("Please set GITLAB_APP_ID value");
        return false;
    }

    /* Check if GITLAB_APP_SECRET is setup as ENV */
    if (!process.env.GITLAB_APP_SECRET) {
        console.log("Please set GITLAB_APP_SECRET value");
        return false;
    }

    /* Check if SESSION_SECRET is setup as ENV */
    if (!process.env.SESSION_SECRET) {
        console.log("Please set SESSION_SECRET value");
        return false;
    }

    return true;
}

function getApikey() {
    let apikey = process.env.APIKEY || "";
    return apikey;
}

function getGitToken() {
    let token = process.env.GIT_TOKEN || "";
    return token;
}

function getGitlabAppId() {
    let appid = process.env.GITLAB_APP_ID || "";
    return appid;
}

function getGitlabAppSecret() {
    let appsecret = process.env.GITLAB_APP_SECRET || "";
    return appsecret;
}

function getSessionSecret() {
    let appsecret = process.env.SESSION_SECRET || "";
    return appsecret;
}

module.exports.getApikey = getApikey;
module.exports.getGitToken = getGitToken;
module.exports.getGitlabAppId = getGitlabAppId;
module.exports.getGitlabAppSecret = getGitlabAppSecret;
module.exports.getSessionSecret = getSessionSecret;
module.exports.checkEnvironment = checkEnvironment;