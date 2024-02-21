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
 * Details: Main Solution Handler
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const morgan = require('morgan');
const express = require('express');
const configEnv = require('./lib/config/env');
const configFile = require('./lib/config/file');
const obfuscatorMid = require('./lib/security/obfuscator');
const authorizerMid = require('./lib/security/authorizer');
const wikiOperator = require('./lib/gitlab/wiki');
const htmlFunctions = require('./lib/html/functions');
const aiOperator = require('./lib/rest-ai/client');

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

/* Create our Express APP */
const app = express();

/* Setup Logging */
app.use(morgan(configFile.getLogFormat()));

/* Middleware Setup */
app.use(obfuscatorMid);
app.use(authorizerMid);

/* Our Images */
app.use('/img', express.static('img'));

/* Initial Page */
app.get('/webui/:project', async (req, res) => {

    /* Getting Gitlab Projec from Request */
    const projectId = req.params.project;

    /* Loading Wiki data */
    let myWikis = await wikiOperator.listWiki(projectId);
    let myHtmlOptions = htmlFunctions.getHtmlOptions(myWikis);

    /* Form HTML */
    let myresponse = htmlFunctions.generateHtmlForm(projectId, myHtmlOptions);
    
    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

app.get('/process/:model/:project/:page', async (req, res) => {

    /* Getting request parameters */
    let aiModel = req.params.model;
    let projectId = req.params.project;
    let slug = req.params.page;

    /* Loading dta from Wiki */
    let pageContent = await wikiOperator.getWiki(projectId, slug);

    /* Refresh URL formation */
    let refreshUrl = await wikiOperator.getProjectUrl(projectId);

    /* Response Content */
    let refreshContent = htmlFunctions.generateRefreshPage(refreshUrl);

    /* figuring out which AI Api to call */
    if (aiModel == "document") {
        let newPagePath = slug + "_" + configFile.getDocumentosufix();
        let newPageContent = await aiOperator.generateDoc(pageContent);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            res.header("Content-Type", "text/html");
            res.send(refreshContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else if (aiModel == "cypress") {
        let newPagePath = slug.replace(configFile.getDocumentosufix(), configFile.getCypresssufix());
        let newPageContent = await aiOperator.generateCypress(pageContent);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            res.header("Content-Type", "text/html");
            res.send(refreshContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else if (aiModel == "playwright") {
        let newPagePath = slug.replace(configFile.getDocumentosufix(), configFile.getPlaywrightsufix());
        let newPageContent = await aiOperator.generatePlaywright(pageContent);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            res.header("Content-Type", "text/html");
            res.send(refreshContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else if (aiModel == "eval") {
        let newPagePath = slug + "_" + configFile.getAvaliadorsufix();
        let newPageContet = await aiOperator.generateEvaluation(pageContent);
        let newPageComment = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContet);
        if (newPageComment) {
            res.header("Content-Type", "text/html");
            res.send(refreshContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else {
        res.statusCode = 400;
        res.send("Bad Request");
    }
});

/* Starting Application */
app.listen(port, () => {
    console.log('Listening on port', port);
});

