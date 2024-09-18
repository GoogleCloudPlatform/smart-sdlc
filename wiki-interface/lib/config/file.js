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
 * Details: Handle Config File
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const config = require('config');

function checkConfigFile() {
    let test;

    /* Check evaluator.url */
    try {
        test = config.get('evaluator.url');
    } catch (e) {
        console.log("No evaluator.url set in config file");
        return false;
    }

    /* Check evaluator.sufix */
    try {
        test = config.get('evaluator.sufix');
    } catch (e) {
        console.log("No evaluator.sufix set in config file");
        return false;
    }

    /* Check generator.url */
    try {
        test = config.get('generator.url');
    } catch (e) {
        console.log("No generator.url set in config file");
        return false;
    }

    /* Check generator.sufix */
    try {
        test = config.get('generator.sufix');
    } catch (e) {
        console.log("No generator.sufix set in config file");
        return false;
    }

    /* Check cypress.url */
    try {
        test = config.get('cypress.url');
    } catch (e) {
        console.log("No cypress.url set in config file");
        return false;
    }

    /* Check cypress.sufix */
    try {
        test = config.get('cypress.sufix');
    } catch (e) {
        console.log("No cypress.sufix set in config file");
        return false;
    }

    /* Check playwright.url */
    try {
        test = config.get('playwright.url');
    } catch (e) {
        console.log("No playwright.url set in config file");
        return false;
    }

    /* Check cypress.sufix */
    try {
        test = config.get('playwright.sufix');
    } catch (e) {
        console.log("No playwright.sufix set in config file");
        return false;
    }

    /* Check data.url */
    try {
        test = config.get('data.url');
    } catch (e) {
        console.log("No data.url set in config file");
        return false;
    }

    /* Check image.url */
    try {
        test = config.get('image.url');
    } catch (e) {
        console.log("No image.url set in config file");
        return false;
    }

    /* Check logging.format */
    try {
        test = config.get('logging.format');
    } catch (e) {
        console.log("No logging.format set in config file");
        return false;
    }

    /* Check server.name */
    try {
        test = config.get('server.name');
    } catch (e) {
        console.log("No server.name set in config file");
        return false;
    }

    /* Check gitlab.url */
    try {
        test = config.get('gitlab.url');
    } catch (e) {
        console.log("No gitlab.url set in config file");
        return false;
    }

    /* Check gitlab.callback */
    try {
        test = config.get('gitlab.callback');
    } catch (e) {
        console.log("No gitlab.callback set in config file");
        return false;
    }

    /* Check gitlab.timeout */
    try {
        test = config.get('gitlab.timeout');
    } catch (e) {
        console.log("No gitlab.timeout set in config file");
        return false;
    }

    /* Check main.language */
    try {
        test = config.get('main.language');
    } catch (e) {
        console.log("No main.language set in config file");
        return false;
    }

    /* Check bigquery.dataset */
    try {
        test = config.get('bigquery.dataset');
    } catch (e) {
        console.log("No bigquery.dataset set in config file");
        return false;
    }

    return true;
}

function getEvaluatorUrl() {
    let url;

    /* Get evaluator.url */
    try {
        url = config.get('evaluator.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getEvaluatorsufix() {
    let sufix;

    /* Get evaluator.sufix */
    try {
        sufix = config.get('evaluator.sufix');
    } catch (e) {
        return "";
    }

    return sufix;
}

function getGeneratorUrl() {
    let url;

    /* Get generator.url */
    try {
        url = config.get('generator.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getGeneratorsufix() {
    let sufix;

    /* Get generator.sufix */
    try {
        sufix = config.get('generator.sufix');
    } catch (e) {
        return "";
    }

    return sufix;
}

function getCypressUrl() {
    let url;

    /* Get cypress.url */
    try {
        url = config.get('cypress.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getCypresssufix() {
    let sufix;

    /* Get cypress.url */
    try {
        sufix = config.get('cypress.sufix');
    } catch (e) {
        return "";
    }

    return sufix;
}

function getPlaywrightUrl() {
    let url;

    /* Get playwright.url */
    try {
        url = config.get('playwright.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getPlaywrightsufix() {
    let sufix;

    /* Get playwright.url */
    try {
        sufix = config.get('playwright.sufix');
    } catch (e) {
        return "";
    }

    return sufix;
}

function getDataUrl() {
    let url;

    /* Get data.url */
    try {
        url = config.get('data.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getImageUrl() {
    let url;

    /* Get image.url */
    try {
        url = config.get('image.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getLogFormat() {
    let logformat;

    /* Check logging.format */
    try {
        logformat = config.get('logging.format');
    } catch (e) {
        return "";
    }

    return logformat;
}

function getServerName() {
    let servername;

    /* Check logging.format */
    try {
        servername = config.get('server.name');
    } catch (e) {
        return "";
    }

    return servername;
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

function getGitlabCallback() {
    let callback;

    /* Check gitlab.url */
    try {
        callback = config.get('gitlab.callback');
    } catch (e) {
        return "";
    }

    return callback;
}

function getLanguage() {
    let language;

    /* Get main.language */
    try {
        language = config.get('main.language');
    } catch (e) {
        return "";
    }

    return language;
}

function getDataset() {
    let dataset;

    /* Get bigquery.dataset */
    try {
        dataset = config.get('bigquery.dataset');
    } catch (e) {
        return "";
    }

    return dataset;
}

module.exports.getEvaluatorUrl = getEvaluatorUrl;
module.exports.getEvaluatorsufix = getEvaluatorsufix;
module.exports.getGeneratorUrl = getGeneratorUrl;
module.exports.getGeneratorsufix = getGeneratorsufix;
module.exports.getCypressUrl = getCypressUrl;
module.exports.getCypresssufix = getCypresssufix;
module.exports.getPlaywrightUrl = getPlaywrightUrl;
module.exports.getPlaywrightsufix = getPlaywrightsufix;
module.exports.getDataUrl = getDataUrl;
module.exports.getImageUrl = getImageUrl;
module.exports.getLogFormat = getLogFormat;
module.exports.getServerName = getServerName;
module.exports.checkConfigFile = checkConfigFile;
module.exports.getGitlabTimeout = getGitlabTimeout;
module.exports.getGitlabUrl = getGitlabUrl;
module.exports.getGitlabCallback = getGitlabCallback;
module.exports.getLanguage = getLanguage;
module.exports.getDataset = getDataset;
