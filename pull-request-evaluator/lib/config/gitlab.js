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

const config = require('config');

function checkConfigFile() {

    let test;

    /* Check gitlab.url */
    try {
        test = config.get('gitlab.url');
    } catch (e) {
        console.log("No gitlab.url set in config file");
        return false;
    }

    /* Check gitlab.timeout */
    try {
        test = config.get('gitlab.timeout');
    } catch (e) {
        console.log("No gitlab.timeout set in config file");
        return false;
    }

    return true;

}

function getGitlabTimeout() {
    let timeout = 0;

    /* Check gitlab.timeout */
    try {
        timeout = config.get('gitlab.timeout');
    } catch (e) {
        return timeout;
    }

    return timeout;
}

function getGitlabUrl() {
    let url;

    /* Check gitlab.url */
    try {
        url = config.get('gitlab.url');
    } catch (e) {
        return "";
    }

    return url;
}

module.exports.checkConfigFile = checkConfigFile;
module.exports.getGitlabUrl = getGitlabUrl;
module.exports.getGitlabTimeout = getGitlabTimeout;