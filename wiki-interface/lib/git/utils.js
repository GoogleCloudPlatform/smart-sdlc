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

const fs = require('node:fs');
const path = require('path')
const { promisify } = require('util');
const simpleGit = require('simple-git');
const envHelper = require('../../lib/config/env');
const configFile = require('../../lib/config/file')

async function cloneGitRepo(repositoryUrl, accessToken, transID) {

    let exists = promisify(fs.exists);
    let formattedRepoUrl = "";

    let targetPath = configFile.getWorkDir() + "/" + transID

    try {
        // Check if the repository already exists locally
        let repoExists = await exists(targetPath);

        // Adding access token to our URL
        if(accessToken != "") {
            if (repositoryUrl.includes("https://")) {
                formattedRepoUrl = repositoryUrl.replace('https://', `https://wiki-interface:${accessToken}@`);
            } else {
                formattedRepoUrl = repositoryUrl.replace('http://', `http://wiki-interface:${accessToken}@`);
            }
        } else {
            formattedRepoUrl = repositoryUrl;
        }

        const git = simpleGit();

        if (repoExists) {
            // Repository exists, pull latest changes
            await git.cwd(targetPath).pull(formattedRepoUrl, 'master', { '--depth': 1000 });
        } else {
            // Repository doesn't exist, clone it
            await git.clone(formattedRepoUrl, targetPath, ['--depth=1000']);
        }
    } catch (error) {
        console.error('Synchronization failed:', error);
    }

}

/* Clone wiki repo for images */
async function cloneWiki(url, repo) {
    let dir = path.join(process.cwd(), repo);
    url = url.replaceAll(".git", ".wiki.git");
    let myUrl = url;
    myUrl = myUrl.replaceAll("://", "://wiki-interface:" + envHelper.getGitToken() + "@");
    try {
        const git = simpleGit();
        await git.clone(myUrl, dir, ['--depth=10']);
        return true;
    } catch (err) {
        console.log(JSON.stringify(err));
        return false;
    }
}

async function removeLocalSource(uuid) {

     let targetPath = configFile.getWorkDir() + "/" + uuid
     let tempFile  = configFile.getWorkDir() + "/temp_" + uuid + ".txt";

    try {
        await fs.unlink(tempFile);
        await fs.rm(targetPath, { recursive: true, force: true });
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`Directory '${targetPath}' not found.`);
        } else {
            console.error(`Failed to remove directory '${targetPath}':`, error);
        }
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

module.exports.cloneGitRepo = cloneGitRepo;
module.exports.cloneWiki = cloneWiki;
module.exports.removeLocalSource = removeLocalSource;
module.exports.getFileFromRepo = getFileFromRepo;
module.exports.deleteClone = deleteClone;