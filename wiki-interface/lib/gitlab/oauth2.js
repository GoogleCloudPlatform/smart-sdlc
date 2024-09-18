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

const passport = require("passport");
const GitLabStrategy = require("passport-gitlab2");
const configHelper = require('../../lib/config/file');
const envHelper = require('../../lib/config/env');

passport.use(
    new GitLabStrategy(
        {
            clientID: envHelper.getGitlabAppId(),
            clientSecret: envHelper.getGitlabAppSecret(),
            callbackURL: configHelper.getGitlabCallback(),
            baseURL: configHelper.getGitlabUrl
        },
        function (accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (user, cb) {
    cb(null, user);
});