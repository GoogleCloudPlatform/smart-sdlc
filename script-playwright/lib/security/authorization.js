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

const configEnv = require('../config/env');

module.exports = function authorizeRequest(req, res, next) {
    /* Loading User Agent from our Environment */
    const userAgent = configEnv.getUseragent();

    /* Loading User Agent from the request */
    const userAgentReq = req.headers['User-Agent'] || req.headers['user-agent'];

    /* Checking if User Agent on the request is valid */
    if (userAgentReq === undefined || !userAgentReq.toLowerCase().includes(userAgent.toLowerCase())) {
        res.statusCode = 401;
        res.end('Unauthorized\n');
    } else {
        next();
    }
}
