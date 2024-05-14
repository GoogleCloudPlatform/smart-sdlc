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
 * wiki-interface
 * Interface com Wiki
 * Details: Handle Request Authorization
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const configHelper = require('../../lib/config/file');

module.exports = function authorizeRequest(req, res, next) {

    /* Validating Referer */
    const refererReq = req.headers['Referer'] || req.headers['referer'];

    const myReferer = configHelper.getGitlabUrl().toLowerCase();
    const myServerName = configHelper.getServerName();

    if (refererReq === undefined ||
        (!refererReq.toLowerCase().includes(myReferer) &&
            !refererReq.toLowerCase().includes(myServerName))) {
        res.statusCode = 401;
        res.end('Unauthorized\n');
        return null;
    }

    /* Validating Origin Site */
    const secfetchsiteReq = req.headers['sec-fetch-site'] || "";

    if (secfetchsiteReq === undefined ||
        (secfetchsiteReq.toLowerCase() != "cross-site" &&
            secfetchsiteReq.toLowerCase() != "same-origin")) {
        res.statusCode = 401;
        res.end('Unauthorized\n');
        return null;
    }

    next();
}