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
 * Interface com Gitlab Wiki
 * Details: Gitlab Wiki Api
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */
const fs = require('fs')
const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const envHelper = require('../../lib/config/env');

/* Clone wiki repo for images */
async function cloneWiki(url, repo) {
    let dir = path.join(process.cwd(), repo);
    url = url.replaceAll(".git", ".wiki.git");
    let myUrl = url;
    myUrl = myUrl.replaceAll("://","://abc123:" + envHelper.getGitToken() + "@");
    try {
        await git.clone({
            fs,
            http,
            dir,
            depth: 1,
            url: myUrl
        });
        return true;
    } catch (err) {
        console.log(JSON.stringify(err));
        return false;
    }
}

/* Delete local copy */
async function deleteClone(repo) {
    let dir = path.join(process.cwd(), repo);
    try {
        await fs.rmSync(dir, { recursive: true, force: true });
        return true;
    } catch (err) {
        console.log(JSON.stringify(err));
        return false;
    }
}

/* Get file contents */
async function getFileFromRepo(repo, file) {
    let dir = path.join(process.cwd(), repo);
    try {
        let contents = await fs.readFileSync(dir + "/" + file);
        return contents;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}


module.exports.cloneWiki = cloneWiki;
module.exports.deleteClone = deleteClone;
module.exports.getFileFromRepo = getFileFromRepo;