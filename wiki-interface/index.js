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
const configEnv = require('./lib/config/env');
const configFile = require('./lib/config/file');
const obfuscatorMid = require('./lib/security/obfuscator');
const wikiOperator = require('./lib/gitlab/wiki');
const htmlFunctions = require('./lib/html/functions');
const aiOperator = require('./lib/rest-ai/client');
const mdOperator = require('./lib/markdown/mdhelper');
const imgOperator = require('./lib/markdown/imghelper');
const gitOperator = require('./lib/gitlab/git');
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

/* Body Parser */
app.use('/process', bodyParser.urlencoded({ extended: true }));
app.use('/rate', bodyParser.urlencoded({ extended: true }));

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

/* Process the main form */
app.post('/process', async (req, res) => {

    /* Getting POST parameters */
    let aiModel = req.body.model;
    let projectId = req.body.project;
    let transactionId = uuidv4();

    /* figuring out which AI Api to call */
    if (aiModel == "tc-generator") {
        let slug = req.body.inputdoc;
        let pageObject = await wikiOperator.getWiki(projectId, slug);
        let pageContent = pageObject.content;

        let baseUrl = await wikiOperator.getProjectUrl(projectId);
         
        /* Checking if markdown has images */
        let imgCheck = await mdOperator.checkImagesOnMarkdown(pageContent);
        if(imgCheck) {
            /* Clone wiki git repo */
            if(await gitOperator.cloneWiki(baseUrl, projectId)) {
                let allImages = await mdOperator.extractImagesFromMarkdown(pageContent);
                /* Process each image */
                for(let i = 0; i < allImages.length; i++) {
                    let imgName = allImages[i].altText;
                    let imgUrl = allImages[i].url;
                    let imgMime = await imgOperator.getMimeType(imgUrl);
                    let imgContent = await gitOperator.getFileFromRepo(projectId, imgUrl);
                    let imgHash = await imgOperator.getBase64(imgContent);
                    let imageDesc = await aiOperator.describeImage(imgMime, imgHash);
                    pageContent = await mdOperator.replaceImagesInMarkdown(pageContent, imgName, imageDesc);
                }
            }
        }

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
        let slug = req.body.inputdoc;
        let pageContent = await wikiOperator.getWiki(projectId, slug);
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
        let slug = req.body.inputdoc;
        let pageContent = await wikiOperator.getWiki(projectId, slug);
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
        let slug = req.body.inputdoc;
        let pageContent = await wikiOperator.getWiki(projectId, slug);
        let newPagePath = slug + "_" + configFile.getEvaluatorsufix();
        let newPageContent = await aiOperator.generateEvaluation(pageContent);
        let ratingContent = await htmlFunctions.generateRatingPage(transactionId, newPageContent, projectId, newPagePath);
        let newPageResult = await wikiOperator.createWikiPage(projectId, newPagePath, newPageContent);
        if (newPageResult) {
            await metricOperator.insertMetric(transactionId, projectId, slug, newPagePath, aiModel);
            res.header("Content-Type", "text/html");
            res.send(ratingContent);
        } else {
            console.log(newPageResult);
            res.statusCode = 500;
            res.send("Internal Error");
        }
    } else if (aiModel == "testdata") {
        let pageContent = req.body.inputdoc;
        let qty = req.body.datasampleqty;
        let newPageContent = await aiOperator.generateTestData(pageContent, qty);
        let ratingContent = await htmlFunctions.generateRatingPage(transactionId, newPageContent, projectId, "test-data");
        if (newPageContent) {
            await metricOperator.insertMetric(transactionId, projectId, "test-data", "test-data", "test-data");
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

app.post('/rate', async (req, res) => {

    /* Getting request parameters */
    let projectId = req.body.project;
    let document = req.body.document;
    let transactionId = req.body.id;
    let rating = req.body.rating;

    await metricOperator.insertRating(transactionId, parseInt(rating));

    /* if rate is 0 delete page */
    if((rating == 0 || rating == "0") && document != "test-data") {
        _ = await wikiOperator.deleteWikiPage(projectId, document);
    }

    /* Refresh URL formation */
    let refreshUrl = await wikiOperator.getProjectUrl(projectId);

    res.redirect(refreshUrl);

});

/* Starting Application */
app.listen(port, () => {
    console.log('Listening on port', port);
});

