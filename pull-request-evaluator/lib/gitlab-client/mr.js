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
 * Details: Merge Request Handler
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const gitlabClient = require('./client');
const staticHelper = require('../../lib/config/statics');

/* Initial greet! */
async function createInitialMrComment(projectId, mrIid) {
    let body = staticHelper.getGreet();
    await createMrComment(projectId, mrIid, body);
}

/* Help message */
async function createHelpMrComment(projectId, mrIid) {
    let body = staticHelper.getHelp();
    await createMrComment(projectId, mrIid, body);
}

/* Create new comment in MR */
async function createMrComment(projectId, mrIid, body) {
    let comm;
    try {
        comm = await gitlabClient.MergeRequestNotes.create(projectId, mrIid, body);
    } catch (err) {
        return null;
    }
}

/* Get the Merge Request */
async function getMr(projectId, mrIid) {
    let mr;
    try {
        mr = await gitlabClient.MergeRequests.show(projectId, mrIid);
        return mr;
    } catch (err) {
        return null;
    }
}

/* Get all Diffs from MR */
async function getMrDiff(mr) {
    try {
        const diff = await gitlabClient.MergeRequests.allDiffs(mr.project_id, mr.iid);
        return diff;
    } catch (err) {
        return null;
    }
}

/* Get file content */
async function getFileRaw(projectId, thisFile, ref) {
    try {
        const raw = await gitlabClient.RepositoryFiles.showRaw(projectId, thisFile.new_path, ref);
        return raw;
    } catch (err) {
        return "";
    }
}

/* Load Full Merge Request */
async function loadFull(projectId, mrIid) {

    let thisMr;
    let changeList = [];

    thisMr = await getMr(projectId, mrIid);

    let fileList = await getMrDiff(thisMr);

    for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        let fileContent = await getFileRaw(projectId, file, thisMr.diff_refs.base_sha);
        let newContent = await getFileRaw(projectId, file, thisMr.diff_refs.head_sha);
        let thisChange = {
            fileName: file.new_path,
            fileContent: fileContent,
            fileDiff: file.diff,
            newContent: newContent
        }
        changeList.push(thisChange);
    }
    return changeList;
}

module.exports.loadFull = loadFull;
module.exports.createInitialMrComment = createInitialMrComment;
module.exports.createHelpMrComment = createHelpMrComment;
module.exports.createMrComment = createMrComment;