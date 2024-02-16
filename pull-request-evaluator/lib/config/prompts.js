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
 * Details: Handle Prompt Files
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const fs = require('node:fs');
const configFile = require('../../lib/config/file');

/* Check if prompt file is present */
function checkContexts() {
    let filename;
    let myprompt;

    try {
        filename = "config/prompts/diffrank_" + configFile.getLanguage() + ".txt";
        myprompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("File not found: " + filename);
        return false;
    }

    try {
        filename = "config/prompts/diffsummary_" + configFile.getLanguage() + ".txt";
        myprompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("File not found: " + filename);
        return false;
    }

    try {
        filename = "config/prompts/prsummary_" + configFile.getLanguage() + ".txt";
        myprompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("File not found: " + filename);
        return false;
    }

    try {
        filename = "config/prompts/filesummary_" + configFile.getLanguage() + ".txt";
        myprompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("File not found: " + filename);
        return false;
    }

    try {
        filename = "config/prompts/filesecurity_" + configFile.getLanguage() + ".txt";
        myprompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("File not found: " + filename);
        return false;
    }

    try {
        filename = "config/prompts/fileperformance_" + configFile.getLanguage() + ".txt";
        myprompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("File not found: " + filename);
        return false;
    }

    return true;
}

/* Return Pull Request Summary Prompt */
function getPrSummary() {
    let filename;
    let prompt;

    try {
        filename = "config/prompts/prsummary_" + configFile.getLanguage() + ".txt";
        prompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log(e);
        return "";
    }
    return prompt;
}

/* Return Diff Summary Prompt */
function getDiffSummary() {
    let filename;
    let prompt;

    try {
        filename = "config/prompts/diffsummary_" + configFile.getLanguage() + ".txt";
        prompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log(e);
        return "";
    }
    return prompt;
}

/* Return Diff Rank Prompt */
function getDiffRank() {
    let filename;
    let prompt;

    try {
        filename = "config/prompts/diffrank_" + configFile.getLanguage() + ".txt";
        prompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log(e);
        return "";
    }
    return prompt;
}

/* Return File Summary Prompt */
function getFileSummary() {
    let filename;
    let prompt;

    try {
        filename = "config/prompts/filesummary_" + configFile.getLanguage() + ".txt";
        prompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log(e);
        return "";
    }
    return prompt;
}

/* Return File Performance Prompt */
function getFilePerformance() {
    let filename;
    let prompt;

    try {
        filename = "config/prompts/fileperformance_" + configFile.getLanguage() + ".txt";
        prompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log(e);
        return "";
    }
    return prompt;
}

/* Return File Security Prompt */
function getFileSecurity() {
    let filename;
    let prompt;

    try {
        filename = "config/prompts/filesecurity_" + configFile.getLanguage() + ".txt";
        prompt = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log(e);
        return "";
    }
    return prompt;
}

module.exports.checkContexts = checkContexts;
module.exports.getPrSummary = getPrSummary;
module.exports.getDiffSummary = getDiffSummary;
module.exports.getDiffRank = getDiffRank;
module.exports.getFileSummary = getFileSummary;
module.exports.getFileSecurity = getFileSecurity;
module.exports.getFilePerformance = getFilePerformance;