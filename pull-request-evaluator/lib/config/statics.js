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

/* Check if greet file is present */
function checkStatics() {
    let mystatic;
    try {
        mystatic = fs.readFileSync('static/greet_' + configFile.getLanguage() + '.md', 'utf8');
    } catch (e) {
        console.log("File not found: greet.md");
        return false;
    }

    try {
        mystatic = fs.readFileSync('static/help_' + configFile.getLanguage() + '.md', 'utf8');
    } catch (e) {
        console.log("File not found: help.md");
        return false;
    }

    return true;
}

/* Return Greet file contents */
function getGreet() {
    let greet;
    try {
        greet = fs.readFileSync('static/greet_' + configFile.getLanguage() + '.md', 'utf8');
    } catch (e) {
        return "";
    }
    return greet;
}

/* Return Help file contents */
function getHelp() {
    let help;
    try {
        help = fs.readFileSync('static/help_' + configFile.getLanguage() + '.md', 'utf8');
    } catch (e) {
        return "";
    }
    return help;
}

module.exports.checkStatics = checkStatics;
module.exports.getGreet = getGreet;
module.exports.getHelp = getHelp;