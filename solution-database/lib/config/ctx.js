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

const fs = require('node:fs');
const configFile = require('../../lib/config/file');

/* Check if context file is present */
function checkContext() {
    let filename;
    let mycontext;

    try {
        filename  = "config/main_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("No AI " + filename + " file.");
        return false;
    }
    try {
        filename  = "config/overview_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("No AI " + filename + " file.");
        return false;
    }
    try {
        filename  = "config/mermaid_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("No AI " + filename + " file.");
        return false;
    }
    try {
        filename  = "config/solution_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log("No AI " + filename + " file.");
        return false;
    }
    return true;
}

/* Return main context file contents */
function getMainContext() {
    let filename;
    let mycontext;

    try {
        filename  = "config/main_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        return "";
    }
    return mycontext;
}

/* Return overview context file contents */
function getOverviewContext() {
    let filename;
    let mycontext;

    try {
        filename  = "config/overview_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        return "";
    }
    return mycontext;
}

/* Return mermaid context file contents */
function getMermaidContext() {
    let filename;
    let mycontext;

    try {
        filename  = "config/mermaid_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        return "";
    }
    return mycontext;
}

/* Return summary context file contents */
function getSolutionContext() {
    let filename;
    let mycontext;

    try {
        filename  = "config/solution_" + configFile.getLanguage() + ".txt";
        mycontext = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        return "";
    }
    return mycontext;
}

module.exports.checkContext = checkContext;
module.exports.getMainContext = getMainContext;
module.exports.getOverviewContext = getOverviewContext;
module.exports.getMermaidContext = getMermaidContext;
module.exports.getSolutionContext = getSolutionContext;