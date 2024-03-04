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
 * Details: Main Implementation
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const process = require('node:process');
const configEnv = require('./lib/config/env');
const configHelper = require('./lib/config/file');
const staticHelper = require('./lib/config/statics');
const promptHelper = require('./lib/config/prompts');
const authenticationMid = require('./lib/security/authentication');
const authorizationMid = require('./lib/security/authorization');
const githubHandler = require('./lib/github-webhook/event-handler');
const gitlabHandler = require('./lib/gitlab-webhook/event-handler');
const obfuscatorMid = require('./lib/security/obfuscator');

/* Server Listening Port */
const port = process.env.PORT || 8080

/* Checking our Config File */
if (!configHelper.checkConfigFile()) {
    process.exit(1);
}

/* Checking our Environment Variables */
if (!configEnv.checkEnvironment()) {
    process.exit(1);
}

/* Checking our Prompt Files */
if (!promptHelper.checkContexts()) {
    process.exit(1);
}

/* Checking our Static Files */
if (!staticHelper.checkStatics()) {
    process.exit(1);
}

/* Create our Express APP */
const app = express();

/* Logging */
app.use(morgan(configHelper.getLogFormat()));

/* Obfuscator */
app.use(obfuscatorMid);

/* Middleware Setup */
const captureRaw = (req, res, buffer) => { req.raw = buffer };
app.use(bodyParser.json({ verify: captureRaw }));
app.use('/webhook', authorizationMid);  /* Authorize Request    */
app.use('/webhook', authenticationMid); /* Authenticate Request */

/* Health Check */
app.get('/hc', async (req, res) => {
    res.send("OK");
});

app.post('/webhook', async (req, res) => {

    /*
     * Process the event received
     */
    let myGit = await configHelper.getGitType();
    if (myGit == "github") {
        githubHandler.handle(req.body);
    } else if (myGit == "gitlab") {
        gitlabHandler.handle(req.body);
    }
    res.send("OK");

});

/* Starting Application */
app.listen(port, () => {
    console.log('Listening on port', port)
});