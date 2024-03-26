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
 * image-processor
 * Processador de Prototipos de Tela
 * Details: Handle API_KEY Header Authentication
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const configEnv = require('../../lib/config/env');

module.exports = function authenticateRequest(req, res, next) {
    /* Loading APIKEY from our Environment */
    const apiKey = configEnv.getApikey();

    /* Loading API_KEY from the request */
    const userKey = req.headers['API_KEY'] || req.headers['api_key'];

    /* Checking if API_KEY on the request is valid */
    if (userKey === undefined || userKey === "" || userKey !== apiKey) {
        res.statusCode = 401;
        res.end('Unauthorized\n');
    } else {
        next();
    }
}