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

const RedisStore = require("connect-redis").default
const redisUtils = require('redis');
const configFile = require('../../lib/config/file');

function getRedisStore() {
    /* Redis Client */
    let redisClient = redisUtils.createClient({
        url: configFile.getRedisURL()
    });
    redisClient.connect().catch(console.error)

    /* Redis Store */
    let redisStore = new RedisStore({
        client: redisClient,
    });

    return redisStore
}

module.exports.getRedisStore = getRedisStore;