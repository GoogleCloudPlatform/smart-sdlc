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

const githubClient = require('../../lib/github-client/client');
const staticHelper = require('../../lib/config/statics');
const excludeHelper = require('../../lib/config/excluder');

/* Initial greet! */
async function createInitialPrComment(owner, repo, issue_number) {
    let body = staticHelper.getGreet();
    await createPrComment(owner, repo, issue_number, body);
}

/* Help message */
async function createHelpPrComment(owner, repo, issue_number) {
    let body = staticHelper.getHelp();
    await createPrComment(owner, repo, issue_number, body);
}

/* Create new comment in PR */
async function createPrComment(owner, repo, issue_number, body) {
    try {
        await githubClient.issues.createComment({
            owner,
            repo,
            issue_number,
            body
        });
    } catch (err) {
        console.log(err);
        return null;
    }
}

/* List commits from PR */
async function getAllCommitsId(owner, repo, pull_number) {
    const allCommits = []
    let page = 1
    let commits
    try {
        do {
            commits = await githubClient.pulls.listCommits({
                owner,
                repo,
                pull_number,
                page
            });
            allCommits.push(...commits.data.map(commit => commit.sha));
            page++;
        } while (commits.data.length > 0)
    } catch (err) {
        console.log(err);
        return null;
    }
    return allCommits
}

/* The the Branch Diff */
async function getPrDiff(owner, repo, pull_request) {
    try {
        const targetBranchDiff = await githubClient.repos.compareCommits({
            owner,
            repo,
            base: pull_request.data.base.sha,
            head: pull_request.data.head.sha
        });
        return targetBranchDiff;
    } catch (err) {
        console.log(err);
        return null;
    }
}

/* Get the PR */
async function getPr(owner, repo, pull_request) {
    try {
        const pullRequest = await githubClient.rest.pulls.get({
            owner,
            repo,
            pull_number: pull_request,
        });
        return pullRequest;
    } catch (err) {
        console.log(err);
        return null;
    }
}

/* Load Original file and Diff */
async function getFileAndDiff(owner, repo, file, basesha) {
    let thisFile = {
        fileName: null,
        fileContent: null,
        newContent: null,
        fileDiff: null,
        diffSummary: null,
        changeStatus: null
    };

    thisFile.fileName = file.filename;

    try {
        const contents = await githubClient.repos.getContent({
            owner: owner,
            repo: repo,
            path: file.filename,
            ref: basesha
        });
        if (contents.data != null) {
            if (!Array.isArray(contents.data)) {
                if (contents.data.type === 'file' && contents.data.content != null) {
                    thisFile.fileContent = Buffer.from(contents.data.content, 'base64').toString();
                }
            }
        }
    } catch (err) {
        /* Probably a 404, brand new file */
        console.log(err);
        thisFile.fileContent = "";
    }

    if (file.patch != null) {
        thisFile.fileDiff = file.patch;
    }

    return thisFile;

}

/* Get the resulting file (Original + Diff) */
async function getNewFileContent(owner, repo, file, diffsha) {

    let newContent = "";

    try {
        const contents = await githubClient.repos.getContent({
            owner: owner,
            repo: repo,
            path: file.filename,
            ref: diffsha
        });
        if (contents.data != null) {
            if (!Array.isArray(contents.data)) {
                if (contents.data.type === 'file' && contents.data.content != null) {
                    newContent = Buffer.from(contents.data.content, 'base64').toString();
                }
            }
        }
    } catch (err) {
        console.log(err);
        return "";
    }

    return newContent;

}

/* Load PR contents */
async function loadFullPr(owner, repo, pr_number) {

    let thisPr;
    let changeList = [];

    /*
     * We need to loop a little bit
     * because when we receive the
     * webhook, the PR is not ready for
     * us to consume every field.
     */
    let targetBranchDiff;
    do {
        thisPr = await getPr(owner, repo, pr_number);
        targetBranchDiff = await getPrDiff(owner, repo, thisPr);
    } while (targetBranchDiff == null)

    const files = targetBranchDiff.data.files;

    /* Loading files */
    for (const file of files) {
        if (await excludeHelper.filterPath(file.filename)) {
            thisFile = await getFileAndDiff(owner, repo, file, thisPr.data.sha);
            thisFile.newContent = await getNewFileContent(owner, repo, file, targetBranchDiff.data.sha);
            changeList.push(thisFile);
        }
    }

    return changeList;
}

module.exports.createPrComment = createPrComment;
module.exports.createInitialPrComment = createInitialPrComment;
module.exports.createHelpPrComment = createHelpPrComment;
module.exports.getAllCommitsId = getAllCommitsId;
module.exports.getPrDiff = getPrDiff;
module.exports.getPr = getPr;
module.exports.getFileAndDiff = getFileAndDiff;
module.exports.getNewFileContent = getNewFileContent;
module.exports.loadFullPr = loadFullPr;