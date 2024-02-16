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
 * Details: Check if this is a valid Event
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const configFile = require('../../lib/config/file');

module.exports = async function authorizeRequest(req, res, next) {

    let myGit = await configFile.getGitType();

    if (myGit == "github") {
        /* Getting header from Request */
        const githubEventReq = req.headers['x-github-event'];

        /* Checking if Github Event Header is present on the request */
        if (githubEventReq === undefined || githubEventReq == "") {
            res.statusCode = 400;
            res.end('Bad Request\n');
        } else {
            next();
        }
    } else if (myGit == "gitlab") {
        /* Getting header from Request */
        const gitlabEventReq = req.headers['x-gitlab-event'];

        /* Checking if Gitlab Event Header is present on the request */
        if (gitlabEventReq === undefined || gitlabEventReq == "") {
            res.statusCode = 400;
            res.end('Bad Request\n');
        } else {
            next();
        }
    } else {
        res.statusCode = 400;
        res.end('Bad Request\n');
    }
}