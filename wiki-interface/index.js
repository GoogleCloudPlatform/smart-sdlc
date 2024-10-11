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
const session = require("express-session")
const crypto = require("crypto");

const oauthHelper = require('./lib/gitlab/oauth2');
const redisSession = require('./lib/redis/session');
const configEnv = require('./lib/config/env');
const configFile = require('./lib/config/file');
const ctxHelper = require('./lib/config/ctx');
const obfuscatorMid = require('./lib/security/obfuscator');
const sessionMid = require('./lib/security/session');
const gitlabOperator = require('./lib/gitlab/wiki');
const metricOperator = require('./lib/metrificator/operator');
const uiFunctions = require('./lib/html/ui');
const gitUtils = require('./lib/git/utils');
const fileUtils = require('./lib/file/file');
const gcsUtils = require('./lib/gcs/gcs');
const apiv1 = require("./lib/api/v1");

/* Server Listening Port */
const port = process.env.PORT || 8080;

/* Checking our Config File */
if (!configFile.checkConfigFile()) {
    process.exit(1);
}

/* Checking our Contexts */
if (!ctxHelper.checkContext()) {
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

/******************** 
 * SESSION SETUP
 ********************/
let ourPassport = oauthHelper.getPassport();
app.use(
    session({
        store: redisSession.getRedisStore(),
        resave: true,
        saveUninitialized: false,
        cookie: { secure: false },
        secret: configEnv.getSessionSecret(),
    }),
)
app.use(ourPassport.initialize());
app.use(ourPassport.session());
app.use('/api', sessionMid);
app.use('/ui', sessionMid);

/********************
 * GITLAB Oauth 
 ********************/
app.get(`/gitlab`, (req, res, next) => {
    const state = "/ui/";
    const authenticator = ourPassport.authenticate('gitlab', { scope: ["read_user"], state })
    authenticator(req, res, next)
})

app.get("/gitlab/callback",
    ourPassport.authenticate("gitlab", { failureRedirect: "/failure" }), async (req, res) => {
        if (req.isAuthenticated()) {
            let redirectTo = req.query["state"];
            if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
                res.redirect(redirectTo)
            } else {
                res.redirect(configFile.getGitlabUrl());
            }
        }
    }
);

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.send("Error logging out.");
        }

        req.session.destroy(function (err) {
            if (err) {
                return res.send("Error destroying session.");
            }
            res.redirect(configFile.getGitlabUrl());
        });
    });
});

/******************** 
 * STATIC CONTENT
 ********************/
app.use("/images", express.static("./ui/images"));
app.use("/css", express.static("./ui/css"));
app.use("/js", express.static("./ui/js"));
app.use("/static", express.static("./ui/static"));

/********************
 * UI SECTION 
 ********************/
/* About/Dashboard Screen */
app.get('/ui/about', async (req, res) => {
    let myresponse = uiFunctions.renderAbout();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* User Story Screen */
app.get('/ui/userstory', async (req, res) => {
    let myresponse = uiFunctions.renderUserStory();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Test Case Screen */
app.get('/ui/testcase', async (req, res) => {
    let myresponse = uiFunctions.renderTestCase();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Test Script Screen */
app.get('/ui/testscript', async (req, res) => {
    let myresponse = uiFunctions.renderTestScript();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Test Data Screen */
app.get('/ui/testdata', async (req, res) => {
    let myresponse = uiFunctions.renderTestData();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Document Chatbot Screen */
app.get('/ui/docchatbot', async (req, res) => {
    /* Generate a Chat Session */
    let chatSession = crypto.randomUUID();
    req.session.chatSession = chatSession;
    /* Getting Repo URL */
    let projectId = req.session.projectId; 
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    repoId = repoId.replaceAll(".git", ".wiki.git");

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), chatSession);
        /* Build Chat Page */
        let myresponse = uiFunctions.renderDocChatbot();

        res.header("Content-Type", "text/html");
        res.send(myresponse);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + chatSession;
        await fileUtils.getAllFilesContentsForChat(dirPath, chatSession);
        await gcsUtils.uploadToGCS(chatSession);
        await gcsUtils.createAndUploadEmptyJSON(chatSession);
        gitUtils.removeLocalSource(chatSession);
    } else {
        response.status = "FAILED"
        res.redirect('/ui/');
    }
});

/* Code Chatbot Screen */
app.get('/ui/codechatbot', async (req, res) => {
    /* Generate a Chat Session */
    let chatSession = crypto.randomUUID();
    req.session.chatSession = chatSession;
    /* Getting Repo URL */
    let projectId = req.session.projectId; 
    let repoId = await gitlabOperator.getProjectUrl(projectId);

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), chatSession);
        /* Build Chat Page */
        let myresponse = uiFunctions.renderCodeChatbot();

        res.header("Content-Type", "text/html");
        res.send(myresponse);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + chatSession;
        await fileUtils.getAllFilesContentsForChat(dirPath, chatSession);
        await gcsUtils.uploadToGCS(chatSession);
        await gcsUtils.createAndUploadEmptyJSON(chatSession);
        gitUtils.removeLocalSource(chatSession);
    } else {
        response.status = "FAILED"
        res.redirect('/ui/');
    }
});

/* Our Search Screen */
app.get('/ui/codesearch', async (req, res) => {
    let myresponse = uiFunctions.renderCodeSearch();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Solution Overview Screen */
app.get('/ui/solutionoverview', async (req, res) => {
    let myresponse = uiFunctions.renderSolutionOverview();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Solution Overview Screen */
app.get('/ui/solutiondatabase', async (req, res) => {
    let myresponse = uiFunctions.renderSolutionDatabase();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Solution API Screen */
app.get('/ui/solutionapi', async (req, res) => {
    let myresponse = uiFunctions.renderSolutionAPI();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Solution Dependency Screen */
app.get('/ui/solutiondep', async (req, res) => {
    let myresponse = uiFunctions.renderSolutionDep();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Solution Integration Screen */
app.get('/ui/solutionintegration', async (req, res) => {
    let myresponse = uiFunctions.renderSolutionIntegration();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Solution Security Screen */
app.get('/ui/solutionsecurity', async (req, res) => {
    let myresponse = uiFunctions.renderSolutionSecurity();

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Index */
app.get('/ui', async (req, res) => {
    let projectName = req.session.projectName;
    let username = req.session.passport.user.displayName;
    let myresponse = uiFunctions.renderIndex(username, projectName);

    res.header("Content-Type", "text/html");
    res.send(myresponse);
});

/* Select Project Screen */
app.get('/ui/selectproject', async (req, res) => {
    let projectName = req.session.projectName;
    let username = req.session.passport.user.displayName;
    if (!req.headers["referer"] || !req.headers["referer"].includes("/ui/")) {
        let myresponse = uiFunctions.renderSelectProjectFull(username, projectName);
        res.header("Content-Type", "text/html");
        res.send(myresponse);
    } else {
        let myresponse = uiFunctions.renderSelectProject();
        res.header("Content-Type", "text/html");
        res.send(myresponse);
    }

});

/* Select Project Action */
app.get('/ui/setproject/:projectId', async (req, res) => {
    let projectId = req.params.projectId;
    let projectName = await apiv1.getProjectName(projectId);
    req.session.projectId = projectId;
    req.session.projectName = projectName;
    res.redirect('/ui/');
});

/********************
 * API SECTION
 ********************/

/* Check if Chatbot Doc session is present on Cloud Storage */
app.get('/api/v1/checkdocsession', async function (req, res, next) {
    let chatSession = req.session.chatSession;
    response = await apiv1.checkChatSession(chatSession);
    res.json(response);
});

/* Check if Chatbot Code session is present on Cloud Storage */
app.get('/api/v1/checkcodesession', async function (req, res, next) {
    let chatSession = req.session.chatSession;
    response = await apiv1.checkChatSession(chatSession);
    res.json(response);
});

/* send message to Document Chatbot */
app.post('/api/v1/docmessage', bodyParser.json(), async function (req, res, next) {
    let chatSession = req.session.chatSession;
    let inputMessage = req.body.message;
    let response = await apiv1.sendDocChatMessage(chatSession, inputMessage);
    res.json(response);
});

/* send message to Code Chatbot */
app.post('/api/v1/codemessage', bodyParser.json(), async function (req, res, next) {
    let chatSession = req.session.chatSession;
    let inputMessage = req.body.message;
    let response = await apiv1.sendCodeChatMessage(chatSession, inputMessage);
    res.json(response);
});

/* Load Project List */
app.get('/api/v1/projects', async function (req, res, next) {
    let response = await apiv1.getProjects()
    res.json(response);
});

/* Load User Story List for Evaluation*/
app.get('/api/v1/userstoryoptions', async function (req, res, next) {
    let projectId = req.session.projectId;
    let response = await apiv1.getUsOptions(projectId);
    res.json(response);
});

/* Load User Story List for Test Case Creation */
app.get('/api/v1/testcaseoptions', async function (req, res, next) {
    let projectId = req.session.projectId;
    let response = await apiv1.getTcOptions(projectId);
    res.json(response);
});

/* Load Test Case List for Script Creation */
app.get('/api/v1/testscriptoptions', async function (req, res, next) {
    let projectId = req.session.projectId;
    let response = await apiv1.getTsOptions(projectId);
    res.json(response);
});

/* Evaluate User Story */
app.post('/api/v1/userstory', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let inputDoc = req.body.documentId;
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processUserStory(projectId, inputDoc);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, response.documentId, response.pagePath, "userstory-evaluator");
    res.json(response);
});

/* Create Test Case */
app.post('/api/v1/testcase', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let inputDoc = req.body.documentId;
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processTestCase(projectId, inputDoc);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, response.documentId, response.pagePath, "testcase-generator");
    res.json(response);
});

/* Create Cypress Script */
app.post('/api/v1/cypress', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let inputDoc = req.body.documentId;
    let gitlabUser = req.session.passport.user.displayName; 
    let response = await apiv1.processCypress(projectId, inputDoc);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, response.documentId, response.pagePath, "script-cypress");
    res.json(response);
});

/* Create Playwright Script */
app.post('/api/v1/playwright', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let inputDoc = req.body.documentId;
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processPlaywright(projectId, inputDoc);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, response.documentId, response.pagePath, "script-playwright");
    res.json(response);
});

/* Create Selenium Script */
app.post('/api/v1/selenium', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let inputDoc = req.body.documentId;
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processSelenium(projectId, inputDoc);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, response.documentId, response.pagePath, "script-selenium");
    res.json(response);
});

/* Perform Codesearch */
app.post('/api/v1/codesearch', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let userQuery = req.body.userQuery;
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processCodeSearch(projectId, repoId, userQuery);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "code-search", "code-search", "code-search");
    res.json(response);
});

/* Code Overview */
app.get('/api/v1/solutionoverview', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processSolutionOverview(projectId, repoId);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "solution-overview", "solution-overview", "solution-overview");
    res.json(response);
});

/* Database Overview */
app.get('/api/v1/solutiondatabase', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processSolutionDatabase(projectId, repoId);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "solution-database", "solution-database", "solution-database");
    res.json(response);
});

/* API Overview */
app.get('/api/v1/solutionapi', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processSolutionAPI(projectId, repoId);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "solution-api", "solution-api", "solution-api");
    res.json(response);
});

/* Dependency Overview */
app.get('/api/v1/solutiondep', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processSolutionDep(projectId, repoId);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "solution-dependency", "solution-dependency", "solution-dependency");
    res.json(response);
});

/* Integration Overview */
app.get('/api/v1/solutionintegration', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processSolutionIntegration(projectId, repoId);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "solution-integration", "solution-integration", "solution-integration");
    res.json(response);
});

/* Security Overview */
app.get('/api/v1/solutionsecurity', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let repoId = await gitlabOperator.getProjectUrl(projectId);
    let gitlabUser = req.session.passport.user.displayName;
    let response = await apiv1.processSolutionSecurity(projectId, repoId);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "solution-security", "solution-security", "solution-security");
    res.json(response);
});

/* Check Document Exists */
app.post('/api/v1/checkdocument', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let inputDoc = req.body.documentId;
    let modelId = req.body.modelId;
    let response = await apiv1.checkDocumentExists(projectId, inputDoc, modelId);
    res.json(response);
});

/* Create Test Data */
app.post('/api/v1/testdata', bodyParser.json(), async function (req, res, next) {
    let projectId = req.session.projectId;
    let gitlabUser = req.session.passport.user.displayName;
    let inputDoc = req.body.documentId;
    let sampleQty = req.body.sampleQty;
    let modelId = req.body.modelId;
    let response = await apiv1.processTestData(projectId, modelId, inputDoc, sampleQty);
    await metricOperator.insertMetric(response.transactionId, gitlabUser, response.projectId, "test-data", "test-data", modelId);
    res.json(response);
});

/* Rating Entry */
app.post('/api/v1/rating', bodyParser.json(), async function (req, res, next) {
    let response = "";
    let projectId = req.session.projectId;
    let documentId = req.body.documentId;
    let documentContent = req.body.documentContent;
    let documentPath = req.body.documentPath;
    let transactionId = req.body.transactionId;
    let ratingValue = req.body.ratingValue;

    await metricOperator.insertRating(transactionId, parseInt(ratingValue));

    if (documentId != "do-not-save") {
        response = await apiv1.createDocument(projectId, documentPath, documentContent);
    }

    res.json(response);

});

/* Starting Application */
app.listen(port, () => {
    console.log('Listening on port', port);
});

