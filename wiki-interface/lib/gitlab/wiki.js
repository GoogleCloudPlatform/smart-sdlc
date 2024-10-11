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

const gitlabClient = require('./client');

/* List wiki pages */
async function listWiki(projectId) {
    let wikiList;
    try {
        wikiList = await gitlabClient.ProjectWikis.all(projectId);
        return wikiList;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

/* Get Wiki Page Content */
async function getWiki(projectId, slug) {
    let thisWiki;
    try {
        thisWiki = await gitlabClient.ProjectWikis.show(projectId, slug);
        return thisWiki;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

/* Create a new page */
async function createWikiPage(projectId, name, body) {
    let wk;
    try {
        wk = await gitlabClient.ProjectWikis.create(projectId, body, name);
        return wk;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

/* Delete a page */
async function deleteWikiPage(projectId, name) {
    let wk;
    try {
        wk = await gitlabClient.ProjectWikis.remove(projectId, name);
        return wk;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

/* Get Gitlab Project Id */
async function getProjectUrl(projectId) {
    let url;
    try {
        let fullProject = await gitlabClient.Projects.show(projectId);
        url = fullProject.http_url_to_repo;
        return url;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

/* Get Gitlab Project Id */
async function getProjectName(projectId) {
    let name;
    try {
        let fullProject = await gitlabClient.Projects.show(projectId);
        name = fullProject.name;
        return name;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

/* List Gitlab Projects */
async function getProjectList() {
    let prjList;
    try {
        let fullPrj = await gitlabClient.Projects.all();
        return fullPrj
    } catch (err) {
        console.log(JSON.stringify(err))
        return null;
    }
}

module.exports.createWikiPage = createWikiPage;
module.exports.listWiki = listWiki;
module.exports.getWiki = getWiki;
module.exports.deleteWikiPage = deleteWikiPage;
module.exports.getProjectUrl = getProjectUrl;
module.exports.getProjectList = getProjectList;
module.exports.getProjectName = getProjectName;