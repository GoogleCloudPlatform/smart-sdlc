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

const crypto = require("crypto");
const configFile = require('../../lib/config/file');
const configEnv = require('../../lib/config/env');
const gitlabOperator = require('../../lib/gitlab/wiki');
const fileUtils = require('../../lib/file/file');
const gitOperator = require('../../lib/git/utils');
const aiOperator = require('../../lib/rest-ai/client');
const mdOperator = require('../../lib/markdown/mdhelper');
const imgOperator = require('../../lib/markdown/imghelper');
const vertexUtils = require('../../lib/vertex/vertex');
const gcsUtils = require('../../lib/gcs/gcs');
const gitUtils = require('../../lib/git/utils');

/* build a list for User Stories */
async function getUsOptions(projectId) {

    /* Loading Wiki data */
    let wikiList = await gitlabOperator.listWiki(projectId);

    let options = [];

    /* Sorting Data */
    wikiList = wikiList.sort(function (a, b) {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if (x > y) { return 1; }
        if (x < y) { return -1; }
        return 0;
    });

    for (let thisWiki of wikiList) {
        if (!thisWiki.title.includes(configFile.getGeneratorsufix()) && !thisWiki.title.includes(configFile.getCypresssufix()) &&
            !thisWiki.title.includes(configFile.getPlaywrightsufix()) && !thisWiki.title.includes(configFile.getEvaluatorsufix())) {
            let thisOption = {
                value: thisWiki.slug,
                label: thisWiki.title
            }
            options.push(thisOption);
        }
    }
    return options;
}

/* build an HTML list for User Stories */
async function getTcOptions(projectId) {

    /* Loading Wiki data */
    let wikiList = await gitlabOperator.listWiki(projectId);

    let options = [];

    /* Sorting Data */
    wikiList = wikiList.sort(function (a, b) {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if (x > y) { return 1; }
        if (x < y) { return -1; }
        return 0;
    });

    for (let thisWiki of wikiList) {
        if (!thisWiki.title.includes(configFile.getGeneratorsufix()) && !thisWiki.title.includes(configFile.getCypresssufix()) &&
            !thisWiki.title.includes(configFile.getPlaywrightsufix()) && !thisWiki.title.includes(configFile.getEvaluatorsufix())) {
            let thisOption = {
                value: thisWiki.slug,
                label: thisWiki.title
            }
            options.push(thisOption);
        }
    }
    return options;
}

/* build an HTML list for Test Cases */
async function getTsOptions(projectId) {

    /* Loading Wiki data */
    let wikiList = await gitlabOperator.listWiki(projectId);

    let options = [];

    /* Sorting Data */
    wikiList = wikiList.sort(function (a, b) {
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if (x > y) { return 1; }
        if (x < y) { return -1; }
        return 0;
    });

    for (let thisWiki of wikiList) {
        if (thisWiki.title.includes(configFile.getGeneratorsufix())) {
            let thisOption = {
                value: thisWiki.slug,
                label: thisWiki.title
            }
            options.push(thisOption);
        }
    }
    return options;
}

async function processUserStory(projectId, documentId) {
    let transactionId = crypto.randomUUID();
    let pageObject = await gitlabOperator.getWiki(projectId, documentId);
    let pageContent = pageObject.content;

    let newPagePath = documentId + "_" + configFile.getEvaluatorsufix();
    let newPageContent = await aiOperator.generateEvaluation(pageContent);

    let thisResponse = {
        projectId: projectId,
        documentId: documentId,
        transactionId: transactionId,
        pagePath: newPagePath,
        pageContent: newPageContent
    }

    return thisResponse;
}

async function processTestCase(projectId, documentId) {
    let transactionId = crypto.randomUUID();
    let pageObject = await gitlabOperator.getWiki(projectId, documentId);
    let pageContent = pageObject.content;

    /* Checking if markdown has images */
    let imgCheck = await mdOperator.checkImagesOnMarkdown(pageContent);
    if (imgCheck) {
        /* Get project URL */
        let baseUrl = await gitlabOperator.getProjectUrl(projectId);
        /* Clone wiki git repo */
        if (await gitOperator.cloneWiki(baseUrl, projectId)) {
            let allImages = await mdOperator.extractImagesFromMarkdown(pageContent);
            /* Process each image */
            for (let i = 0; i < allImages.length; i++) {
                let imgName = allImages[i].altText;
                let imgUrl = allImages[i].url;
                let imgMime = await imgOperator.getMimeType(imgUrl);
                let imgContent = await gitOperator.getFileFromRepo(projectId, imgUrl);
                let imgHash = await imgOperator.getBase64(imgContent);
                let imageDesc = await aiOperator.describeImage(imgMime, imgHash);
                pageContent = await mdOperator.replaceImagesInMarkdown(pageContent, imgName, imageDesc);
            }
            await gitOperator.deleteClone(projectId);
        }
    }

    let newPagePath = documentId + "_" + configFile.getGeneratorsufix();
    let newPageContent = await aiOperator.generateDoc(pageContent);
    let thisResponse = {
        projectId: projectId,
        documentId: documentId,
        transactionId: transactionId,
        pagePath: newPagePath,
        pageContent: newPageContent
    }

    return thisResponse;
}

async function processCypress(projectId, documentId) {
    let transactionId = crypto.randomUUID();
    let pageObject = await gitlabOperator.getWiki(projectId, documentId);
    let pageContent = pageObject.content;

    let newPagePath = documentId.replace(configFile.getGeneratorsufix(), configFile.getCypresssufix());
    let newPageContent = await aiOperator.generateCypress(pageContent);

    let thisResponse = {
        projectId: projectId,
        documentId: documentId,
        transactionId: transactionId,
        pagePath: newPagePath,
        pageContent: newPageContent
    }

    return thisResponse;
}

async function processPlaywright(projectId, documentId) {
    let transactionId = crypto.randomUUID();
    let pageObject = await gitlabOperator.getWiki(projectId, documentId);
    let pageContent = pageObject.content;

    let newPagePath = documentId.replace(configFile.getGeneratorsufix(), configFile.getPlaywrightsufix());
    let newPageContent = await aiOperator.generatePlaywright(pageContent);

    let thisResponse = {
        projectId: projectId,
        documentId: documentId,
        transactionId: transactionId,
        pagePath: newPagePath,
        pageContent: newPageContent
    }

    return thisResponse;
}

async function processSelenium(projectId, documentId) {
    let transactionId = crypto.randomUUID();
    let pageObject = await gitlabOperator.getWiki(projectId, documentId);
    let pageContent = pageObject.content;

    let newPagePath = documentId.replace(configFile.getGeneratorsufix(), configFile.getSeleniumsufix());
    let newPageContent = await aiOperator.generateSelenium(pageContent);

    let thisResponse = {
        projectId: projectId,
        documentId: documentId,
        transactionId: transactionId,
        pagePath: newPagePath,
        pageContent: newPageContent
    }

    return thisResponse;
}

async function processCodeSearch(projectId, repoId, userQuery) {
    let transactionId = crypto.randomUUID();
    let codeBase = "";

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), transactionId);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + transactionId;
        codeBase = await fileUtils.getAllFilesContentsForService(dirPath, transactionId);
        gitUtils.removeLocalSource(transactionId);

        let searchResults = await aiOperator.generateCodeSearch(codeBase, userQuery);

        let thisResponse = {
            projectId: projectId,
            documentId: "do-not-save",
            transactionId: transactionId,
            pagePath: "code-search",
            pageContent: searchResults
        }

        return thisResponse;
    } else {
        return null;
    }
}

async function processSolutionOverview(projectId, repoId) {
    let transactionId = crypto.randomUUID();
    let codeBase = "";

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), transactionId);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + transactionId;
        codeBase = await fileUtils.getAllFilesContentsForService(dirPath, transactionId);
        gitUtils.removeLocalSource(transactionId);

        let codeReport = await aiOperator.generateSolutionOverview(codeBase);

        let thisResponse = {
            projectId: projectId,
            documentId: "do-not-save",
            transactionId: transactionId,
            pagePath: "solution-overview",
            pageContent: codeReport
        }

        return thisResponse;
    } else {
        return null;
    }
}

async function processSolutionDatabase(projectId, repoId) {
    let transactionId = crypto.randomUUID();
    let codeBase = "";

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), transactionId);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + transactionId;
        codeBase = await fileUtils.getAllFilesContentsForService(dirPath, transactionId);
        gitUtils.removeLocalSource(transactionId);

        let codeReport = await aiOperator.generateSolutionDatabase(codeBase);

        let thisResponse = {
            projectId: projectId,
            documentId: "do-not-save",
            transactionId: transactionId,
            pagePath: "solution-database",
            pageContent: codeReport
        }

        return thisResponse;
    } else {
        return null;
    }
}

async function processSolutionAPI(projectId, repoId) {
    let transactionId = crypto.randomUUID();
    let codeBase = "";

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), transactionId);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + transactionId;
        codeBase = await fileUtils.getAllFilesContentsForService(dirPath, transactionId);
        gitUtils.removeLocalSource(transactionId);

        let codeReport = await aiOperator.generateSolutionAPI(codeBase);

        let thisResponse = {
            projectId: projectId,
            documentId: "do-not-save",
            transactionId: transactionId,
            pagePath: "solution-api",
            pageContent: codeReport
        }

        return thisResponse;
    } else {
        return null;
    }
}

async function processSolutionDep(projectId, repoId) {
    let transactionId = crypto.randomUUID();
    let codeBase = "";

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), transactionId);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + transactionId;
        codeBase = await fileUtils.getAllFilesContentsForService(dirPath, transactionId);
        gitUtils.removeLocalSource(transactionId);

        let codeReport = await aiOperator.generateSolutionDep(codeBase);

        let thisResponse = {
            projectId: projectId,
            documentId: "do-not-save",
            transactionId: transactionId,
            pagePath: "solution-dependency",
            pageContent: codeReport
        }

        return thisResponse;
    } else {
        return null;
    }
}

async function processSolutionIntegration(projectId, repoId) {
    let transactionId = crypto.randomUUID();
    let codeBase = "";

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), transactionId);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + transactionId;
        codeBase = await fileUtils.getAllFilesContentsForService(dirPath, transactionId);
        gitUtils.removeLocalSource(transactionId);

        let codeReport = await aiOperator.generateSolutionIntegration(codeBase);

        let thisResponse = {
            projectId: projectId,
            documentId: "do-not-save",
            transactionId: transactionId,
            pagePath: "solution-dependency",
            pageContent: codeReport
        }

        return thisResponse;
    } else {
        return null;
    }
}

async function processSolutionSecurity(projectId, repoId) {
    let transactionId = crypto.randomUUID();
    let codeBase = "";

    if (repoId != "") {
        /* Clone Repo */
        await gitUtils.cloneGitRepo(repoId, configEnv.getGitToken(), transactionId);

        /* Preparing context for AI */
        let dirPath = configFile.getWorkDir() + "/" + transactionId;
        codeBase = await fileUtils.getAllFilesContentsForService(dirPath, transactionId);
        gitUtils.removeLocalSource(transactionId);

        let codeReport = await aiOperator.generateSolutionSecurity(codeBase);

        let thisResponse = {
            projectId: projectId,
            documentId: "do-not-save",
            transactionId: transactionId,
            pagePath: "solution-security",
            pageContent: codeReport
        }

        return thisResponse;
    } else {
        return null;
    }
}

async function checkDocumentExists(projectId, documentId, modelId) {
    let newPagePath = documentId;
    switch (modelId) {
        case "evaluator":
            newPagePath = documentId + "_" + configFile.getEvaluatorsufix();
            break;
        case "testcase":
            newPagePath = documentId + "_" + configFile.getGeneratorsufix();
            break;
        case "script-cypress":
            newPagePath = documentId.replace(configFile.getGeneratorsufix(), configFile.getCypresssufix());
            break;
        case "script-playwright":
            newPagePath = documentId.replace(configFile.getGeneratorsufix(), configFile.getPlaywrightsufix());
            break;
        case "script-selenium":
            newPagePath = documentId.replace(configFile.getGeneratorsufix(), configFile.getSeleniumsufix());
            break;
        default:
            newPagePath = documentId;
            break;
    }
    let pageObject = await gitlabOperator.getWiki(projectId, newPagePath);
    if (pageObject != null) {
        return true;
    } else {
        return false;
    }
}

async function processTestData(projectId, modelId, documentId, sampleQty) {
    let transactionId = crypto.randomUUID();

    let newContent = await aiOperator.generateTestData(modelId, documentId, sampleQty);

    let thisResponse = {
        projectId: projectId,
        documentId: "do-not-save",
        transactionId: transactionId,
        pagePath: "test-data",
        pageContent: newContent
    }

    return thisResponse;
}

async function checkChatSession(chatSession) {
    let response = {
        "status": ""
    }
    if (await gcsUtils.sysinfoExistsSync(chatSession) && await gcsUtils.historyExistsSync(chatSession)) {
        response.status = "OK";
    } else {
        response.status = "NOT_FOUND";
    }

    return response;
}

async function sendCodeChatMessage(chatSession, inputMessage) {
    let responseText = await vertexUtils.sendCodeMessage(chatSession, inputMessage)
    let response = {
        "chatSession": chatSession,
        "message": responseText
    }
    return response;
}

async function sendDocChatMessage(chatSession, inputMessage) {
    let responseText = await vertexUtils.sendDocMessage(chatSession, inputMessage)
    let response = {
        "chatSession": chatSession,
        "message": responseText
    }
    return response;
}

async function getProjects() {
    let response = [];
    let allProjects = await gitlabOperator.getProjectList()
    for (let thisProject of allProjects) {
        let thisEntry = {
            projectId: thisProject.id,
            projectName: thisProject.name
        };
        response.push(thisEntry)
    }
    return response;
}

async function getProjectName(projectId) {
    let thisProject = await gitlabOperator.getProjectName(projectId);
    return thisProject;
}

async function createDocument(projectId, newPagePath, documentContent) {
    let response = await gitlabOperator.createWikiPage(projectId, newPagePath, documentContent);
    return response;
}

module.exports.getUsOptions = getUsOptions;
module.exports.getTcOptions = getTcOptions;
module.exports.getTsOptions = getTsOptions;
module.exports.processUserStory = processUserStory;
module.exports.processTestCase = processTestCase;
module.exports.processCypress = processCypress;
module.exports.processPlaywright = processPlaywright;
module.exports.processSelenium = processSelenium;
module.exports.processCodeSearch = processCodeSearch;
module.exports.processSolutionOverview = processSolutionOverview;
module.exports.processSolutionDatabase = processSolutionDatabase;
module.exports.processSolutionAPI = processSolutionAPI;
module.exports.processSolutionDep = processSolutionDep;
module.exports.processSolutionIntegration = processSolutionIntegration;
module.exports.processSolutionSecurity = processSolutionSecurity;
module.exports.checkDocumentExists = checkDocumentExists;
module.exports.processTestData = processTestData;
module.exports.checkChatSession = checkChatSession;
module.exports.sendCodeChatMessage = sendCodeChatMessage;
module.exports.sendDocChatMessage = sendDocChatMessage;
module.exports.getProjects = getProjects;
module.exports.getProjectName = getProjectName;
module.exports.createDocument = createDocument;
