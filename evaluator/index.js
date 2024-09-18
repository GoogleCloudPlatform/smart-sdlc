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

const morgan = require('morgan');
const express = require('express');
const process = require('node:process');
const bodyParser = require('body-parser');
const obfuscatorMid = require('./lib/security/obfuscator');
const authenticationMid = require('./lib/security/authentication');
const authorizationMid = require('./lib/security/authorization');
const configEnv = require('./lib/config/env');
const configFile = require('./lib/config/file');
const contextFile = require('./lib/config/ctx');
const gcpAiPlatformGemini = require('./lib/gcp/geminihelper');

/* Server Listening Port */
const port = process.env.PORT || 8080;

/* Checking our Config File */
if (!configFile.checkConfigFile()) {
    process.exit(1);
}

/* Checking our Environment Variables */
if (!configEnv.checkEnvironment()) {
    process.exit(1);
}

/* Checking if Context file is present */
if (!contextFile.checkContext()) {
    process.exit(1);
}

/* Create our Express APP */
const app = express();

/* Setup Logging */
app.use(morgan(configFile.getLogFormat()));

/* Obfuscator */
app.use(obfuscatorMid);

/* Middleware Setup */
app.use(bodyParser.text({ type: 'text/markdown', extended: true }));
app.use('/process', authenticationMid); /* Authenticate Request */
app.use('/process', authorizationMid);  /* Authorize Request    */

/* Health Check */
app.get('/hc', async (req, res) => {
    res.send("OK");
});

/* Process Request */
app.post('/process', async (req, res) => {
    let response = "";
    try {
        response = await gcpAiPlatformGemini.evaluateFormat(req.body);
        response += "\n--------------------\n";
        response += await gcpAiPlatformGemini.evaluateContent(req.body);
        res.status = 200;
    } catch(e) {
        console.log(e);
        response = "Internal error";
        res.status = 503;
    }

    res.send(response);
});

/* Starting Application */
app.listen(port, () => {
    console.log('Listening on port', port);
});