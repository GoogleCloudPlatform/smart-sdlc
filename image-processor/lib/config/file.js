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
 * image-processor
 * Processador de Prototipos de Tela
 * Details: Handle Config File
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const config = require('config');

function checkConfigFile() {
    let test;

    /* Check aiplatform.location */
    try {
        test = config.get('aiplatform.location');
    } catch (e) {
        console.log("No aiplatform.location set in config file");
        return false;
    }

    /* Check aiplatform.model */
    try {
        test = config.get('aiplatform.model');
    } catch (e) {
        console.log("No aiplatform.model set in config file");
        return false;
    }

    /* Check aiplatform.temperature */
    try {
        test = config.get('aiplatform.temperature');
    } catch (e) {
        console.log("No aiplatform.temperature set in config file");
        return false;
    }

    /* Check aiplatform.maxtokens */
    try {
        test = config.get('aiplatform.maxtokens');
    } catch (e) {
        console.log("No aiplatform.maxtokens set in config file");
        return false;
    }

    /* Check aiplatform.language */
    try {
        test = config.get('aiplatform.language');
    } catch (e) {
        console.log("No aiplatform.language set in config file");
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

    /* Check grpc.retry */
    try {
        test = config.get('grpc.retry');
    } catch (e) {
        console.log("No grpc.retry set in config file");
        return false;
    }

    /* Check grpc.max_retries */
    try {
        test = config.get('grpc.max_retries');
    } catch (e) {
        console.log("No grpc.max_retries set in config file");
        return false;
    }

    /* Check grpc.timeout */
    try {
        test = config.get('grpc.timeout');
    } catch (e) {
        console.log("No grpc.timeout set in config file");
        return false;
    }

    return true;
}

function getLocation() {
    let location;

    /* Get aiplatform.location */
    try {
        location = config.get('aiplatform.location');
    } catch (e) {
        return "";
    }

    return location;
}

function getModel() {
    let model;

    /* Get aiplatform.model */
    try {
        model = config.get('aiplatform.model');
    } catch (e) {
        return "";
    }

    return model;
}

function getTemperature() {
    let temperature;

    /* Get aiplatform.location */
    try {
        temperature = config.get('aiplatform.temperature');
    } catch (e) {
        return "";
    }

    return temperature;
}

function getMaxtokens() {
    let maxtokens;

    /* Get aiplatform.location */
    try {
        maxtokens = config.get('aiplatform.maxtokens');
    } catch (e) {
        return "";
    }

    return maxtokens;
}

function getLanguage() {
    let language;

    /* Get aiplatform.language */
    try {
        language = config.get('aiplatform.language');
    } catch (e) {
        return "";
    }

    return language;
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

    /* Check server.name */
    try {
        servername = config.get('server.name');
    } catch (e) {
        return "";
    }

    return servername;
}

function getGrpcRetry() {
    let myretry;

    /* Check grpc.retry */
    try {
        myretry = config.get('grpc.retry');
    } catch (e) {
        return false;
    }

    return myretry;
}

function getGrpcMaxRetries() {
    let myretry = 0;

    /* Check grpc.max_retries */
    try {
        myretry = config.get('grpc.max_retries');
    } catch (e) {
        return myretry;
    }

    return myretry;
}

function getGrpcTimeout() {
    let timeout = 0;

    /* Check grpc.timeout */
    try {
        timeout = config.get('grpc.timeout');
    } catch (e) {
        return timeout;
    }

    return timeout;
}

module.exports.getMaxtokens = getMaxtokens;
module.exports.getTemperature = getTemperature;
module.exports.getModel = getModel;
module.exports.getLocation = getLocation;
module.exports.getLogFormat = getLogFormat;
module.exports.getServerName = getServerName;
module.exports.checkConfigFile = checkConfigFile;
module.exports.getGrpcRetry = getGrpcRetry;
module.exports.getGrpcMaxRetries = getGrpcMaxRetries;
module.exports.getGrpcTimeout = getGrpcTimeout;
module.exports.getLanguage = getLanguage;