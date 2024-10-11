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
const configFile = require('../config/file');

/* build rating page */
function generateRatingPage(id, content, projectId, document) {
    let filename  = "templates/ratingform_" + configFile.getLanguage() + ".html";
    let mycontent = fs.readFileSync(filename, 'utf8');

    mycontent = mycontent.replaceAll("__PROJECT-ID__", projectId);
    mycontent = mycontent.replaceAll("__DOCUMENT__", document);
    mycontent = mycontent.replaceAll("__TRANSACTION-ID__", id);

    if(document != "test-data") {
        content = "<div id=\"markdown-content\">\n" + content + "\n</div>\n";
    } else {
        content = "<textarea rows=20 cols=150>\n" + content + "</textarea>\n";
    }

    mycontent = mycontent.replaceAll("__DOC-CONTENTS__", content);

    return mycontent;
}

/* build about page */
function renderAbout() {
    let aboutFile = "ui/page_templates/about_" + configFile.getLanguage() + ".html";
    let aboutContent = fs.readFileSync(aboutFile, 'utf-8');

    return aboutContent;
}

/* build User Story page */
function renderUserStory() {
    let userStoryFile = "ui/page_templates/userstory_" + configFile.getLanguage() + ".html";
    let userStoryContent = fs.readFileSync(userStoryFile, 'utf-8');

    return userStoryContent;
}

/* build Test Case page */
function renderTestCase() {
    let testCaseFile = "ui/page_templates/testcase_" + configFile.getLanguage() + ".html";
    let testCaseContent = fs.readFileSync(testCaseFile, 'utf-8');

    return testCaseContent;
}

/* build Test Script page */
function renderTestScript() {
    let testScriptFile = "ui/page_templates/testscript_" + configFile.getLanguage() + ".html";
    let testScriptContent = fs.readFileSync(testScriptFile, 'utf-8');

    return testScriptContent;
}

/* build Test Data page */
function renderTestData() {
    let testDataFile = "ui/page_templates/testdata_" + configFile.getLanguage() + ".html";
    let testDataContent = fs.readFileSync(testDataFile, 'utf-8');

    return testDataContent;
}

/* build Chatbot page */
function renderCodeChatbot() {
    let chatbotFile = "ui/page_templates/chat_" + configFile.getLanguage() + ".html";
    let chatbotContent = fs.readFileSync(chatbotFile, 'utf-8');

    chatbotContent = chatbotContent.replaceAll("__BOT_TYPE__", "code");

    return chatbotContent;
}

/* build Chatbot page */
function renderDocChatbot() {
    let chatbotFile = "ui/page_templates/chat_" + configFile.getLanguage() + ".html";
    let chatbotContent = fs.readFileSync(chatbotFile, 'utf-8');

    chatbotContent = chatbotContent.replaceAll("__BOT_TYPE__", "doc");

    return chatbotContent;
}

/* build Test Data page */
function renderCodeSearch() {
    let codeSearchFile = "ui/page_templates/codesearch_" + configFile.getLanguage() + ".html";
    let codeSearchContent = fs.readFileSync(codeSearchFile, 'utf-8');

    return codeSearchContent;
}

/* build Test Data page */
function renderSolutionOverview() {
    let solutionOverviewFile = "ui/page_templates/solutionoverview_" + configFile.getLanguage() + ".html";
    let solutionOverviewContent = fs.readFileSync(solutionOverviewFile, 'utf-8');

    return solutionOverviewContent;
}

/* build Test Data page */
function renderSolutionDatabase() {
    let solutionDatabaseFile = "ui/page_templates/solutiondatabase_" + configFile.getLanguage() + ".html";
    let solutionDatabaseContent = fs.readFileSync(solutionDatabaseFile, 'utf-8');

    return solutionDatabaseContent;
}

/* build Test Data page */
function renderSolutionAPI() {
    let solutionAPIFile = "ui/page_templates/solutionapi_" + configFile.getLanguage() + ".html";
    let solutionAPIContent = fs.readFileSync(solutionAPIFile, 'utf-8');

    return solutionAPIContent;
}

/* build Test Data page */
function renderSolutionDep() {
    let solutionDepFile = "ui/page_templates/solutiondep_" + configFile.getLanguage() + ".html";
    let solutionDepContent = fs.readFileSync(solutionDepFile, 'utf-8');

    return solutionDepContent;
}

/* build Test Data page */
function renderSolutionIntegration() {
    let solutionIntegrationFile = "ui/page_templates/solutionintegration_" + configFile.getLanguage() + ".html";
    let solutionIntegrationContent = fs.readFileSync(solutionIntegrationFile, 'utf-8');

    return solutionIntegrationContent;
}

/* build Test Data page */
function renderSolutionSecurity() {
    let solutionSecurityFile = "ui/page_templates/solutionsecurity_" + configFile.getLanguage() + ".html";
    let solutionSecurityContent = fs.readFileSync(solutionSecurityFile, 'utf-8');

    return solutionSecurityContent;
}

/* build Rating page */
function renderRating() {
    let ratingFile = "ui/page_templates/rating_" + configFile.getLanguage() + ".html";
    let ratingContent = fs.readFileSync(ratingFile, 'utf-8');

    return ratingContent;
}

/* build index page */
function renderIndex(username, project) {
    let indexFile = "ui/page_templates/about_" + configFile.getLanguage() + ".html";
    let indexContent = fs.readFileSync(indexFile, 'utf-8');

    let topNavContent = renderTopNav(username, project);
    let sidebarContent = renderSidebar();
    let ratingContent = renderRating();

    let fullContent = renderFullPage(sidebarContent, topNavContent, indexContent, ratingContent);

    return fullContent
}

/* render select project page */
function renderSelectProjectFull(username, project) {
    let selectProjectFile = "ui/page_templates/selectproject_" + configFile.getLanguage() + ".html";
    let selectProjectContent = fs.readFileSync(selectProjectFile, 'utf-8');
    selectProjectContent += "<script src=\"/js/selectproject.js\"></script>";

    let topNavContent = renderTopNav(username, project);
    let sidebarContent = renderSidebar();
    let ratingContent = renderRating();

    let fullContent = renderFullPage(sidebarContent, topNavContent, selectProjectContent, ratingContent);

    return fullContent;
}

/* render select project page */
function renderSelectProject(username, project) {
    let selectProjectFile = "ui/page_templates/selectproject_" + configFile.getLanguage() + ".html";
    let selectProjectContent = fs.readFileSync(selectProjectFile, 'utf-8');

    return selectProjectContent;
}

/* build Top Navigation page */
function renderTopNav(username, project) {
    let topNavFile  = "ui/page_templates/topnav_" + configFile.getLanguage() + ".html";
    let topNavContent = fs.readFileSync(topNavFile, 'utf8');

    if(project === undefined) {
        topNavContent = topNavContent.replaceAll("__SELECTED_PROJECT__", "");
    } else {
        topNavContent = topNavContent.replaceAll("__SELECTED_PROJECT__", project);
    }
    topNavContent = topNavContent.replaceAll("__USERNAME__", username);

    return topNavContent

}

/* build Sidebar page */
function renderSidebar() {
    let sidebarFile  = "ui/page_templates/sidebar_" + configFile.getLanguage() + ".html";
    let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');

    return sidebarContent;
}

/* build complete page page */
function renderFullPage(sidebar, topnav, about, rating) {
    let indexFile  = "ui/index_" + configFile.getLanguage() + ".html";
    let indexContent = fs.readFileSync(indexFile, 'utf8');

    indexContent = indexContent.replaceAll("__SIDEBAR__", sidebar);
    indexContent = indexContent.replaceAll("__TOP_NAV__", topnav);
    indexContent = indexContent.replaceAll("__MAIN_CONTENT__", about);
    indexContent = indexContent.replaceAll("__RATING_CONTENT__", rating);

    return indexContent;
}

module.exports.generateRatingPage = generateRatingPage;
module.exports.renderAbout = renderAbout;
module.exports.renderUserStory = renderUserStory;
module.exports.renderTestCase = renderTestCase;
module.exports.renderTestScript = renderTestScript;
module.exports.renderTestData = renderTestData;
module.exports.renderCodeChatbot = renderCodeChatbot;
module.exports.renderDocChatbot = renderDocChatbot;
module.exports.renderCodeSearch = renderCodeSearch;
module.exports.renderSolutionOverview = renderSolutionOverview;
module.exports.renderSolutionDatabase = renderSolutionDatabase;
module.exports.renderSolutionAPI = renderSolutionAPI;
module.exports.renderSolutionDep = renderSolutionDep;
module.exports.renderSolutionIntegration = renderSolutionIntegration;
module.exports.renderSolutionSecurity = renderSolutionSecurity;
module.exports.renderRating = renderRating;
module.exports.renderIndex = renderIndex;
module.exports.renderSelectProjectFull = renderSelectProjectFull;
module.exports.renderSelectProject = renderSelectProject;