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
 * Details: Invoke our AI Apis
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const configEnv = require('../../lib/config/env');
const configFile = require('../../lib/config/file');

/* call our API that uses chat-bison */
async function generateDoc(content) {
    const aiApiKey = configEnv.getApikey();
    const thisUrl = configFile.getGeneratorUrl();

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/markdown',
            'API_KEY': aiApiKey,
            'User-Agent': configFile.getServerName()
        },
        body: content.toString()
    };

    const response = await fetch(thisUrl, requestOptions);
    const data = await response.text();

    return data;
}

/* call our API that uses codechat-bison */
async function generateCypress(content) {
    const aiApiKey = configEnv.getApikey();
    const thisUrl = configFile.getCypressUrl();

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/markdown',
            'API_KEY': aiApiKey,
            'User-Agent': configFile.getServerName()
        },
        body: content.toString()
    };

    const response = await fetch(thisUrl, requestOptions);
    const data = await response.text();

    return data.replace('```cypress', '```js');
}

/* call our API that uses codechat-bison */
async function generatePlaywright(content) {
    const aiApiKey = configEnv.getApikey();
    const thisUrl = configFile.getPlaywrightUrl();

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/markdown',
            'API_KEY': aiApiKey,
            'User-Agent': configFile.getServerName()
        },
        body: content.toString()
    };

    const response = await fetch(thisUrl, requestOptions);
    const data = await response.text();

    return data.replace('```playwright', '```js');
}

/* call our API that uses chat-bison */
async function generateEvaluation(content) {
    const aiApiKey = configEnv.getApikey();
    const thisUrl = configFile.getEvaluatorUrl();

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/markdown',
            'API_KEY': aiApiKey,
            'User-Agent': configFile.getServerName()
        },
        body: content.toString()
    };

    const response = await fetch(thisUrl, requestOptions);
    const data = await response.text();

    return data;
}

/* call our API that uses chat-bison */
async function generateTestData(content, qty) {
    const aiApiKey = configEnv.getApikey();
    const thisUrl = configFile.getDataUrl() + "/" + qty.toString();

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'API_KEY': aiApiKey,
            'User-Agent': configFile.getServerName()
        },
        body: content.toString()
    };

    const response = await fetch(thisUrl, requestOptions);
    const data = await response.text();

    return data;
}

/* call our API that uses gemini-vision */
async function describeImage(mime, image) {
    const aiApiKey = configEnv.getApikey();
    const thisUrl = configFile.getImageUrl();

    let myReqBody = `{ 
        "mime": "${mime}",
        "image": "${image}"
    }`;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API_KEY': aiApiKey,
            'User-Agent': configFile.getServerName()
        },
        body: myReqBody
    };

    const response = await fetch(thisUrl, requestOptions);
    const data = await response.text();

    return data + "\n\n";
}

module.exports.generateDoc = generateDoc;
module.exports.generateCypress = generateCypress;
module.exports.generatePlaywright = generatePlaywright;
module.exports.generateEvaluation = generateEvaluation;
module.exports.generateTestData = generateTestData;
module.exports.describeImage = describeImage;