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

const githubPr = require('../../lib/github-client/pr');
const configHelper = require('../../lib/config/file');
const aiHelper = require('../../lib/gcp/aihelper');

/* Handle Webhook invocations */
async function handle(data) {
    if (data.issue) {
        handleComment(data);
    } else if (data.pull_request) {
        handlePullRequest(data);
    }
}

/* Comments on the PRs */
async function handleComment(data) {
    let owner = data.repository.owner.login || data.organization.login;
    let repo = data.repository.name;
    let pr = data.issue.number;

    /* getting the pull request and change list */
    let changeList = await githubPr.loadFullPr(owner, repo, pr);

    if (data.comment.body && data.comment.body == "/prSummary") {
        if (configHelper.getFuncPrSummary()) {
            let prSummaryResponse = await aiHelper.prSummary(changeList);
            await githubPr.createPrComment(owner, repo, pr, prSummaryResponse);
        }
    } else if (data.comment.body && data.comment.body == "/diffSummary") {
        if (configHelper.getFuncDiffSummary()) {
            let diffSummaryResponse = await aiHelper.diffSummary(changeList);
            await githubPr.createPrComment(owner, repo, pr, diffSummaryResponse);
        }
    } else if (data.comment.body && data.comment.body == "/diffRank") {
        if (configHelper.getFuncDiffRank()) {
            let diffRankResponse = await aiHelper.diffRank(changeList);
            await githubPr.createPrComment(owner, repo, pr, diffRankResponse);
        }
    } else if (data.comment.body && data.comment.body == "/fileSummary") {
        if (configHelper.getFuncFileSummary()) {
            let fileSummaryResponse = await aiHelper.fileSummary(changeList);
            await githubPr.createPrComment(owner, repo, pr, fileSummaryResponse);
        }
    } else if (data.comment.body && data.comment.body == "/filePerformance") {
        if (configHelper.getFuncFilePerformance()) {
            let filePerformanceResponse = await aiHelper.filePerformance(changeList);
            await githubPr.createPrComment(owner, repo, pr, filePerformanceResponse);
        }
    } else if (data.comment.body && data.comment.body == "/fileSecurity") {
        if (configHelper.getFuncFileSecurity()) {
            let securitySummaryResponse = await aiHelper.fileSecurity(changeList);
            await githubPr.createPrComment(owner, repo, pr, securitySummaryResponse);
        }
    } else if (data.comment.body && data.comment.body == "/help") {
        await githubPr.createHelpPrComment(owner, repo, pr);
    }
}

/* New PR */
async function handlePullRequest(data) {
    /* Brand new PR */
    if (data.action && data.action == "opened" && data.pull_request) {
        let owner = data.repository.owner.login || data.organization.login;
        let repo = data.repository.name;
        let pr = data.number;

        await githubPr.createInitialPrComment(owner, repo, pr);

        /* getting the pull request and change list */
        let changeList = await githubPr.loadFullPr(owner, repo, pr);

        if (configHelper.getFuncPrSummary()) {
            let prSummaryResponse = await aiHelper.prSummary(changeList);
            await githubPr.createPrComment(owner, repo, pr, prSummaryResponse);
        }

        if (configHelper.getFuncDiffSummary()) {
            let diffSummaryResponse = await aiHelper.diffSummary(changeList);
            await githubPr.createPrComment(owner, repo, pr, diffSummaryResponse);
        }

        if (configHelper.getFuncDiffRank()) {
            let diffRankResponse = await aiHelper.diffRank(changeList);
            await githubPr.createPrComment(owner, repo, pr, diffRankResponse);
        }

        if (configHelper.getFuncFileSummary()) {
            let fileSummaryResponse = await aiHelper.fileSummary(changeList);
            await githubPr.createPrComment(owner, repo, pr, fileSummaryResponse);
        }

        if (configHelper.getFuncFilePerformance()) {
            let filePerformanceResponse = await aiHelper.filePerformance(changeList);
            await githubPr.createPrComment(owner, repo, pr, filePerformanceResponse);
        }

        if (configHelper.getFuncFileSecurity()) {
            let fileSecurityResponse = await aiHelper.fileSecurity(changeList);
            await githubPr.createPrComment(owner, repo, pr, fileSecurityResponse);
        }
    }
}

module.exports.handle = handle;