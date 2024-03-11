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
const process = require('node:process');
const configEnv = require('./lib/config/env');
const configFile = require('./lib/config/file');
const obfuscatorMid = require('./lib/security/obfuscator');
const authorizerMid = require('./lib/security/authorizer');
const wikiOperator = require('./lib/gitlab/wiki');
const htmlFunctions = require('./lib/html/functions');
const aiOperator = require('./lib/rest-ai/client');
const metricOperator = require('./lib/metrificator/operator');
const { v4: uuidv4 } = require('uuid');

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

/* Our Static Content */
app.use('/img', express.static('img'));
app.use('/static', express.static('static'));

/* Initial Page */
app.get('/webui/:project', async (req, res) => {

    /* Getting Gitlab Project from Request */
    const projectId = req.params.project;

    /* Loading Wiki data */
    let myWikis = await wikiOperator.listWiki(projectId);

    /* Form HTML */
    let myresponse = htmlFunctions.generateHtmlForm(projectId, myWikis);
    
    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

app.get('/process/:model/:project/:page', async (req, res) => {

    /* Getting request parameters */
    let aiModel = req.params.model;
    let projectId = req.params.project;
    let slug = req.params.page;
    let transactionId = uuidv4();

    /* Loading dta from Wiki */
    let pageContent = await wikiOperator.getWiki(projectId, slug);

    /* figuring out which AI Api to call */
    if (aiModel == "tc-generator") {
        let newPagePath = slug + "_" + configFile.getGeneratorsufix();
        let newPageContent = await aiOperator.generateDoc(pageContent);
        let ratingContent = await htmlFunctions.generateRatingPage(transactionId, newPageContent, projectId, newPagePath);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            await metricOperator.insertMetric(transactionId, projectId, slug, newPagePath, aiModel);
            res.header("Content-Type", "text/html");
            res.send(ratingContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }   
    } else if (aiModel == "script-cypress") {
        let originalPath = slug.replace("_" + configFile.getGeneratorsufix(), "");
        let newPagePath = slug.replace(configFile.getGeneratorsufix(), configFile.getCypresssufix());
        let newPageContent = await aiOperator.generateCypress(pageContent);
        let ratingContent = await htmlFunctions.generateRatingPage(transactionId, newPageContent, projectId, newPagePath);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            await metricOperator.insertMetric(transactionId, projectId, originalPath, newPagePath, aiModel);
            res.header("Content-Type", "text/html");
            res.send(ratingContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else if (aiModel == "script-playwright") {
        let originalPath = slug.replace("_" + configFile.getGeneratorsufix(), "");
        let newPagePath = slug.replace(configFile.getGeneratorsufix(), configFile.getPlaywrightsufix());
        let newPageContent = await aiOperator.generatePlaywright(pageContent);
        let ratingContent = await htmlFunctions.generateRatingPage(transactionId, newPageContent, projectId, newPagePath);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            await metricOperator.insertMetric(transactionId, projectId, originalPath, newPagePath, aiModel);
            res.header("Content-Type", "text/html");
            res.send(ratingContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else if (aiModel == "evaluator") {
        let newPagePath = slug + "_" + configFile.getEvaluatorsufix();
        let newPageContent = await aiOperator.generateEvaluation(pageContent);
        let ratingContent = await htmlFunctions.generateRatingPage(transactionId, newPageContent, projectId, newPagePath);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            await metricOperator.insertMetric(transactionId, projectId, slug, newPagePath, aiModel);
            res.header("Content-Type", "text/html");
            res.send(ratingContent);
        } else {
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else if (aiModel == "us-generator") {
        res.statusCode = 404;
        res.send("Not found!");
    } else {
        res.statusCode = 400;
        res.send("Bad Request");
    }
});

app.get('/rate/:project/:document/:id/:rating', async (req, res) => {

    /* Getting request parameters */
    let projectId = req.params.project;
    let document = req.params.document;
    let transactionId = req.params.id;
    let rating = req.params.rating;

    await metricOperator.insertRating(transactionId, parseInt(rating));

    /* if rate is 0 delete page */
    if(rating == 0 || rating == "0") {
        _ = await wikiOperator.deleteWikiPage(projectId, document);
    }

    /* Refresh URL formation */
    let refreshUrl = await wikiOperator.getProjectUrl(projectId);

    /* Response Content */
    let refreshContent = htmlFunctions.generateRefreshPage(refreshUrl);

    res.header("Content-Type", "text/html");
    res.send(refreshContent);
});

/* Starting Application */
app.listen(port, () => {
    console.log('Listening on port', port);
});

