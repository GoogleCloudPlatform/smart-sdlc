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
 * Details: Authenticate a Github Event
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const envHelper = require('../../lib/config/env');
const configFile = require('../../lib/config/file');
const authHelper = require('../../lib/github-webhook/authenticate');

module.exports = async function authenticateRequest(req, res, next) {

    let myGit = configFile.getGitType();

    if (myGit == "github") {
        /* Getting Signature */
        const signature = req.headers['x-hub-signature'];

        /* Checking if signature is valid */
        if (signature) {
            if (signature == authHelper.signPayload(req.raw)) {
                next();
            } else {
                res.statusCode = 401;
                res.end('Unauthorized\n');
            }
        } else {
            res.statusCode = 401;
            res.end('Unauthorized\n');
        }
    } else if (myGit == "gitlab") {

        /* Check if token sent is iqual to the expected */
        const tokenReceived = req.headers["x-gitlab-token"];
        const tokenConfigured = envHelper.getWebhookSecret();

        if (tokenReceived.toString() != tokenConfigured.toString()) {
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