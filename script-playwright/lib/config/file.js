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
 * script-playwright
 * Gerador de Script de Testes Playwright
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

    /* Check aiplatform.keepalive_timeout */
    try {
        test = config.get('aiplatform.keepalive_timeout');
    } catch (e) {
        console.log("No aiplatform.keepalive_timeout set in config file");
        return false;
    }

    /* Check aiplatform.keepalive_time */
    try {
        test = config.get('aiplatform.keepalive_time');
    } catch (e) {
        console.log("No aiplatform.keepalive_time set in config file");
        return false;
    }

    /* Check aiplatform.enable_retries */
    try {
        test = config.get('aiplatform.enable_retries');
    } catch (e) {
        console.log("No aiplatform.enable_retries set in config file");
        return false;
    }

    /* Check aiplatform.dns_min_time_between_resolutions_ms */
    try {
        test = config.get('aiplatform.dns_min_time_between_resolutions_ms');
    } catch (e) {
        console.log("No aiplatform.dns_min_time_between_resolutions_ms set in config file");
        return false;
    }

    /* Check aiplatform.initial_reconnect_backoff_ms */
    try {
        test = config.get('aiplatform.initial_reconnect_backoff_ms');
    } catch (e) {
        console.log("No aiplatform.initial_reconnect_backoff_ms set in config file");
        return false;
    }

    /* Check aiplatform.max_reconnect_backoff_ms */
    try {
        test = config.get('aiplatform.max_reconnect_backoff_ms');
    } catch (e) {
        console.log("No aiplatform.max_reconnect_backoff_ms set in config file");
        return false;
    }

    /* Check aiplatform.client_idle_timeout_ms */
    try {
        test = config.get('aiplatform.client_idle_timeout_ms');
    } catch (e) {
        console.log("No aiplatform.client_idle_timeout_ms set in config file");
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

function getKeepaliveTimeout() {
    let timeout;

    /* Get aiplatform.keepalive_timeout */
    try {
        timeout = config.get('aiplatform.keepalive_timeout');
    } catch (e) {
        return "";
    }

    return timeout;
}

function getKeepaliveTime() {
    let time;

    /* Get aiplatform.keepalive_time */
    try {
        time = config.get('aiplatform.keepalive_time');
    } catch (e) {
        return "";
    }

    return time;
}

function getEnableRetries() {
    let enableretries;

    /* Get aiplatform.enable_retries */
    try {
        enableretries = config.get('aiplatform.enable_retries');
    } catch (e) {
        return "";
    }

    return enableretries;
}

function getDnsTime() {
    let dnstime;

    /* Get aiplatform.dns_min_time_between_resolutions_ms */
    try {
        dnstime = config.get('aiplatform.dns_min_time_between_resolutions_ms');
    } catch (e) {
        return "";
    }

    return dnstime;
}

function getInitialBackoff() {
    let time;

    /* Get aiplatform.initial_reconnect_backoff_ms */
    try {
        time = config.get('aiplatform.initial_reconnect_backoff_ms');
    } catch (e) {
        return "";
    }

    return time;
}

function getMaxBackoff() {
    let time;

    /* Get aiplatform.max_reconnect_backoff_ms */
    try {
        time = config.get('aiplatform.max_reconnect_backoff_ms');
    } catch (e) {
        return "";
    }

    return time;
}

function getIdleTimeout() {
    let time;

    /* Get aiplatform.client_idle_timeout_ms */
    try {
        time = config.get('aiplatform.client_idle_timeout_ms');
    } catch (e) {
        return "";
    }

    return time;
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
module.exports.getServerName = getServerName;
module.exports.getKeepaliveTime = getKeepaliveTime;
module.exports.getKeepaliveTimeout = getKeepaliveTimeout;
module.exports.getLogFormat = getLogFormat;
module.exports.checkConfigFile = checkConfigFile;
module.exports.getEnableRetries = getEnableRetries;
module.exports.getDnsTime = getDnsTime;
module.exports.getInitialBackoff = getInitialBackoff;
module.exports.getMaxBackoff = getMaxBackoff;
module.exports.getIdleTimeout = getIdleTimeout;
module.exports.getGrpcRetry = getGrpcRetry;
module.exports.getGrpcMaxRetries = getGrpcMaxRetries;
module.exports.getGrpcTimeout = getGrpcTimeout;
module.exports.getLanguage = getLanguage;