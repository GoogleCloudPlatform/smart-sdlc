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

const process = require('node:process');
const githubHelper = require('./lib/github-client/pr');
const gitlabHelper = require('./lib/gitlab-client/mr');
const aiHelper = require('./lib/gcp/aihelper');
const configHelper = require('./lib/config/file.js');
const configEnv = require('./lib/config/env');
const promptHelper = require('./lib/config/prompts');

async function myFunctionGithub(owner, repo, pr) {

    /* getting the pull request and change list */
    let changeList = await githubHelper.loadFullPr(owner, repo, pr);

    if (configHelper.getFuncPrSummary()) {
        console.log("############ prSummary() ############");
        let prSummaryResponse = await aiHelper.prSummary(changeList);
        console.log(prSummaryResponse);
    }

    if (configHelper.getFuncDiffSummary()) {
        console.log("############ diffSummary() ############");
        let diffSummaryResponse = await aiHelper.diffSummary(changeList);
        console.log(diffSummaryResponse);
    }

    if (configHelper.getFuncDiffRank()) {
        console.log("############ diffRank() ############");
        let diffRankResponse = await aiHelper.diffRank(changeList);
        console.log(diffRankResponse);
    }

    if (configHelper.getFuncFileSummary()) {
        console.log("############ fileSummary() ############");
        let fileSummaryResponse = await aiHelper.fileSummary(changeList);
        console.log(fileSummaryResponse);
    }

    if (configHelper.getFuncFilePerformance()) {
        console.log("############ filePerformance() ############");
        let filePerformanceResponse = await aiHelper.filePerformance(changeList);
        console.log(filePerformanceResponse);
    }

    if (configHelper.getFuncFileSecurity()) {
        console.log("############ fileSecurity() ############");
        let securitySummaryResponse = await aiHelper.fileSecurity(changeList);
        console.log(securitySummaryResponse);
    }
}

async function myFunctionGitlab(projectId, mrIid) {

    /* getting the pull request and change list */
    let changeList = await gitlabHelper.loadFull(projectId, mrIid);

    if (configHelper.getFuncPrSummary()) {
        console.log("############ prSummary() ############");
        let prSummaryResponse = await aiHelper.prSummary(changeList);
        console.log(prSummaryResponse);
    }

    if (configHelper.getFuncDiffSummary()) {
        console.log("############ diffSummary() ############");
        let diffSummaryResponse = await aiHelper.diffSummary(changeList);
        console.log(diffSummaryResponse);
    }

    if (configHelper.getFuncDiffRank()) {
        console.log("############ diffRank() ############");
        let diffRankResponse = await aiHelper.diffRank(changeList);
        console.log(diffRankResponse);
    }

    if (configHelper.getFuncFileSummary()) {
        console.log("############ fileSummary() ############");
        let fileSummaryResponse = await aiHelper.fileSummary(changeList);
        console.log(fileSummaryResponse);
    }

    if (configHelper.getFuncFilePerformance()) {
        console.log("############ filePerformance() ############");
        let filePerformanceResponse = await aiHelper.filePerformance(changeList);
        console.log(filePerformanceResponse);
    }

    if (configHelper.getFuncFileSecurity()) {
        console.log("############ fileSecurity() ############");
        let securitySummaryResponse = await aiHelper.fileSecurity(changeList);
        console.log(securitySummaryResponse);
    }
}

function main() {
    /* this file uses all the env and config
     * that the application needs, in other 
     * words, you can turn on and off features
     * on default.yaml.
     * I use this to tune my prompts!
     */

    /* Checking our Config File */
    if (!configHelper.checkConfigFile()) {
        process.exit(1);
    }

    /* Checking our Environment Variables */
    if (!configEnv.checkEnvironment()) {
        process.exit(1);
    }

    /* Checking our Prompt Files */
    if (!promptHelper.checkContexts()) {
        process.exit(1);
    }

    /* Github */
    let owner = "kubernetes";
    let repo = "ingress-nginx";
    let pr = 10797;
    myFunctionGithub(owner, repo, pr);

    /* Gitlab */
    //let projectId = "1";
    //let mrIid = "19";
    //myFunctionGitlab(projectId, mrIid)
}

if (require.main === module) {
    main();
}


