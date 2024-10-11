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

/* Check if exclude file is present */
async function checkInclude() {
    let myinclude;
    try {
        myinclude = await fs.readFileSync('config/include.cfg', 'utf8');
    } catch (e) {
        console.log("File not found: include.cfg");
        return false;
    }
    return true;
}

/* Return exclude file contents */
async function getInclude() {
    let myinclude;
    try {
        myinclude = await fs.readFileSync('config/include.cfg', 'utf8').toString().split("\n");
    } catch (e) {
        return "";
    }
    return myinclude;
}

/* Process exclusion */
async function filterPath(thisPath) {
    let myInclusionList = await getInclude();
    let tmpPath = thisPath.toLowerCase();

    for (let i = 0; i < myInclusionList.length; i++) {
        if (tmpPath.includes(myInclusionList[i])) {
            return true;
        }
    }

    return false;
}

module.exports.checkInclude = checkInclude;
module.exports.getInclude = getInclude;
module.exports.filterPath = filterPath;