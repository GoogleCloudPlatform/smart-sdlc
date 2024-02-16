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
 * Details: Handle Github Config File
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const config = require('config');

function checkConfigFile() {

    let test;

    /* Check github.timeout */
    try {
        test = config.get('github.timeout');
    } catch (e) {
        console.log("No github.timeout set in config file");
        return false;
    }

    /* Check github.throttle */
    try {
        test = config.get('github.throttle');
    } catch (e) {
        console.log("No github.throttle set in config file");
        return false;
    }

    /* Check github.retry */
    try {
        test = config.get('github.retry');
    } catch (e) {
        console.log("No github.retry set in config file");
        return false;
    }

    return true;
}

function getGithubTimeout() {
    let timeout = 0;

    /* Check github.timeout */
    try {
        timeout = config.get('github.timeout');
    } catch (e) {
        return timeout;
    }

    return timeout;
}

function getGithubThrottle() {
    let throttle;

    /* Check github.timeout */
    try {
        throttle = config.get('github.throttle');
    } catch (e) {
        return true;
    }

    return throttle;
}

function getGithubRetry() {
    let retry;

    /* Check github.timeout */
    try {
        retry = config.get('github.retry');
    } catch (e) {
        return true;
    }

    return retry;
}

module.exports.checkConfigFile = checkConfigFile;
module.exports.getGithubTimeout = getGithubTimeout;
module.exports.getGithubRetry = getGithubRetry;
module.exports.getGithubThrottle = getGithubThrottle;