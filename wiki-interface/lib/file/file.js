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
const path = require('path');

const configFile = require("../../lib/config/file");
const configExcl = require("../../lib/config/excluder");
const configIncl = require("../../lib/config/includer");

async function getAllFilesContentsForChat(dirPath, uuid) {
    let tempFile = configFile.getWorkDir() + "/temp_" + uuid + ".txt";

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);

        // Check if it's a directory
        if (fs.lstatSync(filePath).isDirectory()) {
            // Recursively call the function for subdirectories
            if (await configExcl.filterPath(file)) {
                await getAllFilesContentsForChat(filePath, uuid);
            }
        } else if (await configExcl.filterPath(file) && await configIncl.filterPath(file)) {
            // Read the file content
            let fileContent = fs.readFileSync(filePath, 'utf-8');
            // Add the file content to the temp file
            fs.appendFileSync(tempFile, '\n---------- ' + filePath + ' ----------\n');
            fs.appendFileSync(tempFile, fileContent + '\n---------- SEPARATOR ----------\n');

        }
    }
}

async function getAllFilesContentsForService(dirPath, uuid) {
    let repoContent = "";

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);

        // Check if it's a directory
        if (fs.lstatSync(filePath).isDirectory()) {
            // Recursively call the function for subdirectories
            if (await configExcl.filterPath(file)) {
                await getAllFilesContentsForService(filePath, uuid);
            }
        } else if (await configExcl.filterPath(file) && await configIncl.filterPath(file)) {
            // Read the file content
            let fileContent = fs.readFileSync(filePath, 'utf-8');
            // Add the file content to the string
            repoContent += "\n---------- " + filePath + " ----------\n";
            repoContent += fileContent;
            repoContent += "\n---------- SEPARATOR ----------\n";

        }
    }

    return repoContent;
}

async function getFileContent(uuid) {
    let filePath = configFile.getWorkDir() + "/temp_" + uuid + ".txt";
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        let cleanData = cleanFile(data);
        return cleanData;
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        throw error; // Re-throw the error to handle it appropriately in the calling function
    }
}

function cleanFile(str) {
    // Replace all tabs with a single space
    str = str.replace(/\t/g, ' ');

    // Replace multiple spaces with a single space
    str = str.replace(/\s+/g, ' ');

    return str;
}

module.exports.getAllFilesContentsForChat = getAllFilesContentsForChat;
module.exports.getAllFilesContentsForService = getAllFilesContentsForService;
module.exports.getFileContent = getFileContent;
module.exports.cleanFile = cleanFile;
