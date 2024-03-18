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
const process = require('node:process');
const configEnv = require('./lib/config/env');
const configFile = require('./lib/config/file');
const contextFile = require('./lib/config/ctx');
const gcpAiPlatformText = require('./lib/gcp/texthelper');
const gcpAiPlatformChat = require('./lib/gcp/chathelper');
const gcpAiPlatformGemini = require('./lib/gcp/geminihelper');

async function processAi(input, qty) {
    let response = "";
    let model = "";
    model = configFile.getModel();
    if(model.includes("text-bison") || model.includes("code-bison")) {
        response = await gcpAiPlatformText.callPredict(input, qty);
    } else if (model.includes("chat-bison") || model.includes("codechat-bison")) {
        response = await gcpAiPlatformChat.callPredict(input, qty);
    } else if (model.includes("gemini")) {
        response = await gcpAiPlatformGemini.callPredict(input, qty);
    } else {
        response = "Internal error";
    }
    return response;
}

async function main() {
    /* this file uses all the env and config
     * that the application needs, in other 
     * words, you can turn on and off features
     * on default.yaml.
     * I use this to tune my prompts!
     */

    let myQty = 10;

    /* Checking our Config File */
    if (!configFile.checkConfigFile()) {
        process.exit(1);
    }

    /* Checking our Prompt Files */
    if (!contextFile.checkContext()) {
        process.exit(1);
    }

    /* check env */
    if (!configEnv.checkEnvironment()) {
        process.exit(1);
    }

    /* reading our input file */
    let filename;
    let filecontent;
    try {
        filename  = "input.csv";
        filecontent = fs.readFileSync(filename, 'utf8');
    } catch (e) {
        console.log(e);
        filecontent = "";
    }

    let response = await processAi(filecontent, myQty);
    console.log(response);
}

if (require.main === module) {
    main();
}