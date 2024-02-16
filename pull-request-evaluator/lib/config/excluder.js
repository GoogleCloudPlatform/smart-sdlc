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
 * Details: Handle Exclude Config File
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const fs = require('node:fs');

/* Check if exclude file is present */
async function checkExclude() {
    let myexclude;
    try {
        myexclude = await fs.readFileSync('config/exclude.cfg', 'utf8');
    } catch (e) {
        console.log("File not found: exclude.cfg");
        return false;
    }
    return true;
}

/* Return exclude file contents */
async function getExclude() {
    let myexclude;
    try {
        myexclude = await fs.readFileSync('config/exclude.cfg', 'utf8').toString().split("\n");
    } catch (e) {
        return "";
    }
    return myexclude;
}

/* Process exclusion */
async function filterPath(thisPath) {
    let myExclusionList = await this.getExclude();
    let tmpPath = thisPath.toLowerCase();

    for (let i = 0; i < myExclusionList.length; i++) {
        if (tmpPath.includes(myExclusionList[i])) {
            return false;
        }
    }

    return true;
}

module.exports.checkExclude = checkExclude;
module.exports.getExclude = getExclude;
module.exports.filterPath = filterPath;