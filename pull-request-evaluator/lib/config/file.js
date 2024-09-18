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
const gitlabConfig = require('../../lib/config/gitlab');
const githubConfig = require('../../lib/config/github');

function checkConfigFile() {
    let test;

    /* Check aitext.location */
    try {
        test = config.get('aitext.location');
    } catch (e) {
        console.log("No aitext.location set in config file");
        return false;
    }

    /* Check aitext.model */
    try {
        test = config.get('aitext.model');
    } catch (e) {
        console.log("No aitext.model set in config file");
        return false;
    }

    /* Check aitext.temperature */
    try {
        test = config.get('aitext.temperature');
    } catch (e) {
        console.log("No aitext.temperature set in config file");
        return false;
    }

    /* Check aitext.maxtokens */
    try {
        test = config.get('aitext.maxtokens');
    } catch (e) {
        console.log("No aitext.maxtokens set in config file");
        return false;
    }

    /* Check aitext.keepalive_timeout */
    try {
        test = config.get('aitext.keepalive_timeout');
    } catch (e) {
        console.log("No aitext.keepalive_timeout set in config file");
        return false;
    }

    /* Check aitext.keepalive_time */
    try {
        test = config.get('aitext.keepalive_time');
    } catch (e) {
        console.log("No aitext.keepalive_time set in config file");
        return false;
    }

    /* Check aitext.enable_retries */
    try {
        test = config.get('aitext.enable_retries');
    } catch (e) {
        console.log("No aitext.enable_retries set in config file");
        return false;
    }

    /* Check aitext.dns_min_time_between_resolutions_ms */
    try {
        test = config.get('aitext.dns_min_time_between_resolutions_ms');
    } catch (e) {
        console.log("No aitext.dns_min_time_between_resolutions_ms set in config file");
        return false;
    }

    /* Check aitext.initial_reconnect_backoff_ms */
    try {
        test = config.get('aitext.initial_reconnect_backoff_ms');
    } catch (e) {
        console.log("No aitext.initial_reconnect_backoff_ms set in config file");
        return false;
    }

    /* Check aitext.max_reconnect_backoff_ms */
    try {
        test = config.get('aitext.max_reconnect_backoff_ms');
    } catch (e) {
        console.log("No aitext.max_reconnect_backoff_ms set in config file");
        return false;
    }

    /* Check aitext.client_idle_timeout_ms */
    try {
        test = config.get('aitext.client_idle_timeout_ms');
    } catch (e) {
        console.log("No aitext.client_idle_timeout_ms set in config file");
        return false;
    }

    /* Check aicode.location */
    try {
        test = config.get('aicode.location');
    } catch (e) {
        console.log("No aicode.location set in config file");
        return false;
    }

    /* Check aicode.model */
    try {
        test = config.get('aicode.model');
    } catch (e) {
        console.log("No aicode.model set in config file");
        return false;
    }

    /* Check aicode.temperature */
    try {
        test = config.get('aicode.temperature');
    } catch (e) {
        console.log("No aicode.temperature set in config file");
        return false;
    }

    /* Check aicode.maxtokens */
    try {
        test = config.get('aicode.maxtokens');
    } catch (e) {
        console.log("No aicode.maxtokens set in config file");
        return false;
    }

    /* Check aicode.keepalive_timeout */
    try {
        test = config.get('aicode.keepalive_timeout');
    } catch (e) {
        console.log("No aicode.keepalive_timeout set in config file");
        return false;
    }

    /* Check aicode.keepalive_time */
    try {
        test = config.get('aicode.keepalive_time');
    } catch (e) {
        console.log("No aicode.keepalive_time set in config file");
        return false;
    }

    /* Check aicode.enable_retries */
    try {
        test = config.get('aicode.enable_retries');
    } catch (e) {
        console.log("No aicode.enable_retries set in config file");
        return false;
    }

    /* Check aicode.dns_min_time_between_resolutions_ms */
    try {
        test = config.get('aicode.dns_min_time_between_resolutions_ms');
    } catch (e) {
        console.log("No aicode.dns_min_time_between_resolutions_ms set in config file");
        return false;
    }

    /* Check aicode.initial_reconnect_backoff_ms */
    try {
        test = config.get('aicode.initial_reconnect_backoff_ms');
    } catch (e) {
        console.log("No aicode.initial_reconnect_backoff_ms set in config file");
        return false;
    }

    /* Check aicode.max_reconnect_backoff_ms */
    try {
        test = config.get('aicode.max_reconnect_backoff_ms');
    } catch (e) {
        console.log("No aicode.max_reconnect_backoff_ms set in config file");
        return false;
    }

    /* Check aicode.client_idle_timeout_ms */
    try {
        test = config.get('aicode.client_idle_timeout_ms');
    } catch (e) {
        console.log("No aicode.client_idle_timeout_ms set in config file");
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

    /* Check functions.language */
    try {
        test = config.get('functions.language');
    } catch (e) {
        console.log("No functions.language set in config file");
        return false;
    }

    /* Check functions.prsummary */
    try {
        test = config.get('functions.prsummary');
    } catch (e) {
        console.log("No functions.prsummary set in config file");
        return false;
    }

    /* Check functions.diffsummary */
    try {
        test = config.get('functions.diffsummary');
    } catch (e) {
        console.log("No functions.diffsummary set in config file");
        return false;
    }

    /* Check functions.diffrank */
    try {
        test = config.get('functions.diffrank');
    } catch (e) {
        console.log("No functions.diffrank set in config file");
        return false;
    }

    /* Check functions.filesummary */
    try {
        test = config.get('functions.filesummary');
    } catch (e) {
        console.log("No functions.filesummary set in config file");
        return false;
    }

    /* Check functions.fileperformance */
    try {
        test = config.get('functions.fileperformance');
    } catch (e) {
        console.log("No functions.fileperformance set in config file");
        return false;
    }

    /* Check functions.filesecurity */
    try {
        test = config.get('functions.filesecurity');
    } catch (e) {
        console.log("No functions.filesecurity set in config file");
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

    /* Check git.type */
    try {
        test = config.get('git.type');
    } catch (e) {
        console.log("No git.type set in config file");
        return false;
    }

    if (test.toLowerCase() == "gitlab") {
        if (!gitlabConfig.checkConfigFile()) {
            return false;
        }
    } else if (test.toLowerCase() == "github") {
        if (!githubConfig.checkConfigFile()) {
            return false;
        }
    } else {
        console.log("Invalid git.type config");
        return false;
    }

    return true;
}

function getTextLocation() {
    let location;

    /* Get aitext.location */
    try {
        location = config.get('aitext.location');
    } catch (e) {
        return "";
    }

    return location;
}

function getTextModel() {
    let model;

    /* Get aitext.model */
    try {
        model = config.get('aitext.model');
    } catch (e) {
        return "";
    }

    return model;
}

function getTextTemperature() {
    let temperature;

    /* Get aitext.location */
    try {
        temperature = config.get('aitext.temperature');
    } catch (e) {
        return "";
    }

    return temperature;
}

function getTextMaxtokens() {
    let maxtokens;

    /* Get aitext.location */
    try {
        maxtokens = config.get('aitext.maxtokens');
    } catch (e) {
        return "";
    }

    return maxtokens;
}

function getTextKeepaliveTimeout() {
    let timeout;

    /* Get aitext.keepalive_timeout */
    try {
        timeout = config.get('aitext.keepalive_timeout');
    } catch (e) {
        return "";
    }

    return timeout;
}

function getTextKeepaliveTime() {
    let time;

    /* Get aitext.keepalive_time */
    try {
        time = config.get('aitext.keepalive_time');
    } catch (e) {
        return "";
    }

    return time;
}

function getTextEnableRetries() {
    let enableretries;

    /* Get aitext.enable_retries */
    try {
        enableretries = config.get('aitext.enable_retries');
    } catch (e) {
        return "";
    }

    return enableretries;
}

function getTextDnsTime() {
    let dnstime;

    /* Get aitext.dns_min_time_between_resolutions_ms */
    try {
        dnstime = config.get('aitext.dns_min_time_between_resolutions_ms');
    } catch (e) {
        return "";
    }

    return dnstime;
}

function getTextInitialBackoff() {
    let time;

    /* Get aitext.initial_reconnect_backoff_ms */
    try {
        time = config.get('aitext.initial_reconnect_backoff_ms');
    } catch (e) {
        return "";
    }

    return time;
}

function getTextMaxBackoff() {
    let time;

    /* Get aitext.max_reconnect_backoff_ms */
    try {
        time = config.get('aitext.max_reconnect_backoff_ms');
    } catch (e) {
        return "";
    }

    return time;
}

function getTextIdleTimeout() {
    let time;

    /* Get aitext.client_idle_timeout_ms */
    try {
        time = config.get('aitext.client_idle_timeout_ms');
    } catch (e) {
        return "";
    }

    return time;
}

function getLanguage() {
    let language;

    /* Get functions.language */
    try {
        language = config.get('functions.language');
    } catch (e) {
        return "";
    }

    return language;
}

function getCodeLocation() {
    let location;

    /* Get aicode.location */
    try {
        location = config.get('aicode.location');
    } catch (e) {
        return "";
    }

    return location;
}

function getCodeModel() {
    let model;

    /* Get aicode.model */
    try {
        model = config.get('aicode.model');
    } catch (e) {
        return "";
    }

    return model;
}

function getCodeTemperature() {
    let temperature;

    /* Get aicode.location */
    try {
        temperature = config.get('aicode.temperature');
    } catch (e) {
        return "";
    }

    return temperature;
}

function getCodeMaxtokens() {
    let maxtokens;

    /* Get aicode.location */
    try {
        maxtokens = config.get('aicode.maxtokens');
    } catch (e) {
        return "";
    }

    return maxtokens;
}

function getCodeKeepaliveTimeout() {
    let timeout;

    /* Get aicode.keepalive_timeout */
    try {
        timeout = config.get('aicode.keepalive_timeout');
    } catch (e) {
        return "";
    }

    return timeout;
}

function getCodeKeepaliveTime() {
    let time;

    /* Get aicode.keepalive_time */
    try {
        time = config.get('aicode.keepalive_time');
    } catch (e) {
        return "";
    }

    return time;
}

function getCodeEnableRetries() {
    let enableretries;

    /* Get aicode.enable_retries */
    try {
        enableretries = config.get('aicode.enable_retries');
    } catch (e) {
        return "";
    }

    return enableretries;
}

function getCodeDnsTime() {
    let dnstime;

    /* Get aicode.dns_min_time_between_resolutions_ms */
    try {
        dnstime = config.get('aicode.dns_min_time_between_resolutions_ms');
    } catch (e) {
        return "";
    }

    return dnstime;
}

function getCodeInitialBackoff() {
    let time;

    /* Get aicode.initial_reconnect_backoff_ms */
    try {
        time = config.get('aicode.initial_reconnect_backoff_ms');
    } catch (e) {
        return "";
    }

    return time;
}

function getCodeMaxBackoff() {
    let time;

    /* Get aicode.max_reconnect_backoff_ms */
    try {
        time = config.get('aicode.max_reconnect_backoff_ms');
    } catch (e) {
        return "";
    }

    return time;
}

function getCodeIdleTimeout() {
    let time;

    /* Get aicode.client_idle_timeout_ms */
    try {
        time = config.get('aicode.client_idle_timeout_ms');
    } catch (e) {
        return "";
    }

    return time;
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

function getFuncPrSummary() {
    let myfunc;

    /* Check functions.prsummary */
    try {
        myfunc = config.get('functions.prsummary');
    } catch (e) {
        return false;
    }

    return myfunc;
}

function getFuncDiffSummary() {
    let myfunc;

    /* Check functions.diffsummary */
    try {
        myfunc = config.get('functions.diffsummary');
    } catch (e) {
        return false;
    }

    return myfunc;
}

function getFuncDiffRank() {
    let myfunc;

    /* Check functions.diffrank */
    try {
        myfunc = config.get('functions.diffrank');
    } catch (e) {
        return false;
    }

    return myfunc;
}

function getFuncFileSummary() {
    let myfunc;

    /* Check functions.filesummary */
    try {
        myfunc = config.get('functions.filesummary');
    } catch (e) {
        return false;
    }

    return myfunc;
}

function getFuncFilePerformance() {
    let myfunc;

    /* Check functions.fileperformance */
    try {
        myfunc = config.get('functions.fileperformance');
    } catch (e) {
        return false;
    }

    return myfunc;
}

function getFuncFileSecurity() {
    let myfunc;

    /* Check functions.filesecurity */
    try {
        myfunc = config.get('functions.filesecurity');
    } catch (e) {
        return false;
    }

    return myfunc;
}

function getGitType() {
    let type;

    /* Check git.type */
    try {
        type = config.get('git.type');
    } catch (e) {
        return "";
    }

    return type.toString().toLowerCase();
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

module.exports.getTextMaxtokens = getTextMaxtokens;
module.exports.getTextTemperature = getTextTemperature;
module.exports.getTextModel = getTextModel;
module.exports.getTextLocation = getTextLocation;
module.exports.getTextKeepaliveTime = getTextKeepaliveTime;
module.exports.getTextKeepaliveTimeout = getTextKeepaliveTimeout;
module.exports.getTextEnableRetries = getTextEnableRetries;
module.exports.getTextDnsTime = getTextDnsTime;
module.exports.getTextInitialBackoff = getTextInitialBackoff;
module.exports.getTextMaxBackoff = getTextMaxBackoff;
module.exports.getTextIdleTimeout = getTextIdleTimeout;
module.exports.getLanguage = getLanguage;
module.exports.getLogFormat = getLogFormat;
module.exports.checkConfigFile = checkConfigFile;
module.exports.getServerName = getServerName;
module.exports.getGrpcRetry = getGrpcRetry;
module.exports.getGrpcMaxRetries = getGrpcMaxRetries;
module.exports.getGrpcTimeout = getGrpcTimeout;
module.exports.getGitType = getGitType;
module.exports.getFuncPrSummary = getFuncPrSummary;
module.exports.getFuncDiffSummary = getFuncDiffSummary;
module.exports.getFuncDiffRank = getFuncDiffRank;
module.exports.getFuncFileSummary = getFuncFileSummary;
module.exports.getFuncFilePerformance = getFuncFilePerformance;
module.exports.getFuncFileSecurity = getFuncFileSecurity;
module.exports.getCodeMaxtokens = getCodeMaxtokens;
module.exports.getCodeTemperature = getCodeTemperature;
module.exports.getCodeModel = getCodeModel;
module.exports.getCodeLocation = getCodeLocation;
module.exports.getCodeKeepaliveTime = getCodeKeepaliveTime;
module.exports.getCodeKeepaliveTimeout = getCodeKeepaliveTimeout;
module.exports.getCodeEnableRetries = getCodeEnableRetries;
module.exports.getCodeDnsTime = getCodeDnsTime;
module.exports.getCodeInitialBackoff = getCodeInitialBackoff;
module.exports.getCodeMaxBackoff = getCodeMaxBackoff;
module.exports.getCodeIdleTimeout = getCodeIdleTimeout;
