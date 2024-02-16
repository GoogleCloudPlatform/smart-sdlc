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

    /* Check avaliador.url */
    try {
        test = config.get('avaliador.url');
    } catch (e) {
        console.log("No avaliador.url set in config file");
        return false;
    }

    /* Check avaliador.sufix */
    try {
        test = config.get('avaliador.sufix');
    } catch (e) {
        console.log("No avaliador.sufix set in config file");
        return false;
    }

    /* Check documento.url */
    try {
        test = config.get('documento.url');
    } catch (e) {
        console.log("No documento.url set in config file");
        return false;
    }

    /* Check documento.sufix */
    try {
        test = config.get('documento.sufix');
    } catch (e) {
        console.log("No documento.sufix set in config file");
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

    /* Check gitlab.timeout */
    try {
        test = config.get('gitlab.timeout');
    } catch (e) {
        console.log("No gitlab.timeout set in config file");
        return false;
    }

    return true;
}

function getAvaliadorUrl() {
    let url;

    /* Get avaliador.url */
    try {
        url = config.get('avaliador.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getAvaliadorsufix() {
    let sufix;

    /* Get avaliador.sufix */
    try {
        sufix = config.get('avaliador.sufix');
    } catch (e) {
        return "";
    }

    return sufix;
}

function getDocumentoUrl() {
    let url;

    /* Get documento.url */
    try {
        url = config.get('documento.url');
    } catch (e) {
        return "";
    }

    return url;
}

function getDocumentosufix() {
    let sufix;

    /* Get documento.sufix */
    try {
        sufix = config.get('documento.sufix');
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

module.exports.getAvaliadorUrl = getAvaliadorUrl;
module.exports.getAvaliadorsufix = getAvaliadorsufix;
module.exports.getDocumentoUrl = getDocumentoUrl;
module.exports.getDocumentosufix = getDocumentosufix;
module.exports.getCypressUrl = getCypressUrl;
module.exports.getCypresssufix = getCypresssufix;
module.exports.getPlaywrightUrl = getPlaywrightUrl;
module.exports.getPlaywrightsufix = getPlaywrightsufix;
module.exports.getLogFormat = getLogFormat;
module.exports.getServerName = getServerName;
module.exports.checkConfigFile = checkConfigFile;
module.exports.getGitlabTimeout = getGitlabTimeout;
module.exports.getGitlabUrl = getGitlabUrl;
