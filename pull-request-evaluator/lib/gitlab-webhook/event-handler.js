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

const gitlabMr = require('../../lib/gitlab-client/mr');
const configHelper = require('../../lib/config/file');
const aiHelper = require('../../lib/gcp/aihelper');

/* Handle Webhook invocations */
async function handle(data) {


    if (data.event_type == "note" && data.merge_request) {
        handleComment(data);
    } else if (data.event_type == "merge_request" && data.object_attributes) {
        handleMergeRequest(data);
    }
}

/* Comments on the MRs */
async function handleComment(data) {
    let projectId = data.project.id;
    let mrIid = data.merge_request.iid;

    /* getting the merge request and change list */
    let changeList = await gitlabMr.loadFull(projectId, mrIid);

    if (data.object_attributes.note && data.object_attributes.note == "/prSummary") {
        if (configHelper.getFuncPrSummary()) {
            let mrSummaryResponse = await aiHelper.prSummary(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, mrSummaryResponse);
        }
    } else if (data.object_attributes.note && data.object_attributes.note == "/diffSummary") {
        if (configHelper.getFuncDiffSummary()) {
            let diffSummaryResponse = await aiHelper.diffSummary(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, diffSummaryResponse);
        }
    } else if (data.object_attributes.note && data.object_attributes.note == "/diffRank") {
        if (configHelper.getFuncDiffRank()) {
            let diffRankResponse = await aiHelper.diffRank(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, diffRankResponse);
        }
    } else if (data.object_attributes.note && data.object_attributes.note == "/fileSummary") {
        if (configHelper.getFuncFileSummary()) {
            let fileSummaryResponse = await aiHelper.fileSummary(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, fileSummaryResponse);
        }
    } else if (data.object_attributes.note && data.object_attributes.note == "/filePerformance") {
        if (configHelper.getFuncFilePerformance()) {
            let filePerformanceResponse = await aiHelper.filePerformance(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, filePerformanceResponse);
        }
    } else if (data.object_attributes.note && data.object_attributes.note == "/fileSecurity") {
        if (configHelper.getFuncFileSecurity()) {
            let securitySummaryResponse = await aiHelper.fileSecurity(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, securitySummaryResponse);
        }
    } else if (data.object_attributes.note && data.object_attributes.note == "/help") {
        await gitlabMr.createHelpMrComment(projectId, mrIid);
    }
}

/* New MR */
async function handleMergeRequest(data) {
    /* Brand new MR */
    if (data.object_attributes.action == "open") {
        let projectId = data.project.id;
        let mrIid = data.object_attributes.iid;

        await gitlabMr.createInitialMrComment(projectId, mrIid);

        /* getting the merge request and change list */
        let changeList = await gitlabMr.loadFull(projectId, mrIid);

        if (configHelper.getFuncPrSummary()) {
            let mrSummaryResponse = await aiHelper.prSummary(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, mrSummaryResponse);
        }

        if (configHelper.getFuncDiffSummary()) {
            let diffSummaryResponse = await aiHelper.diffSummary(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, diffSummaryResponse);
        }

        if (configHelper.getFuncDiffRank()) {
            let diffRankResponse = await aiHelper.diffRank(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, diffRankResponse);
        }

        if (configHelper.getFuncFileSummary()) {
            let fileSummaryResponse = await aiHelper.fileSummary(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, fileSummaryResponse);
        }

        if (configHelper.getFuncFilePerformance()) {
            let filePerformanceResponse = await aiHelper.filePerformance(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, filePerformanceResponse);
        }

        if (configHelper.getFuncFileSecurity()) {
            let fileSecurityResponse = await aiHelper.fileSecurity(changeList);
            await gitlabMr.createMrComment(projectId, mrIid, fileSecurityResponse);
        }
    }
}

module.exports.handle = handle;