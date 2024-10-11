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

const { Storage } = require('@google-cloud/storage');
const configFile = require("../../lib/config/file");
const fileUtils = require("../../lib/file/file")
const fs = require("node:fs");


async function uploadToGCS(transId) {
    let tempFile = configFile.getWorkDir() + "/temp_" + transId + ".txt";

    try {
        // Create a new Storage client
        const storage = new Storage();

        let bucketName = configFile.getBucket();

        // Get a reference to the bucket
        const bucket = storage.bucket(bucketName);

        // Create a file object with the desired filename
        let filename = "sysinfo_" + transId + ".txt";
        const file = bucket.file(filename);

        // Read the local file's contents into a stream
        const fileStream = fs.createReadStream(tempFile);

        // Upload the file stream to GCS
        await file.save(fileStream);

    } catch (error) {
        console.error('Error uploading string to GCS:', error);
    }
}

async function sysinfoExistsSync(transId) {
    let fileName = "sysinfo_" + transId + ".txt";
    try {
        // Create a new Storage client
        const storage = new Storage();

        let bucketName = configFile.getBucket();

        const file = storage.bucket(bucketName).file(fileName);
        const [exists] = await file.exists();
        return exists;
    } catch (err) {
        console.error('Erro ao verificar a existência do arquivo:', err);
        return false;
    }
}

async function historyExistsSync(transId) {
    let fileName = "history_" + transId + ".txt";
    try {
        // Create a new Storage client
        const storage = new Storage();

        let bucketName = configFile.getBucket();

        const file = storage.bucket(bucketName).file(fileName);
        const [exists] = await file.exists();
        return exists;
    } catch (err) {
        console.error('Erro ao verificar a existência do arquivo:', err);
        return false;
    }
}

async function getFileContents(transId) {
    let fileName = "sysinfo_" + transId + ".txt";
    try {
        // Create a new Storage client
        const storage = new Storage();

        let bucketName = configFile.getBucket();

        const file = storage.bucket(bucketName).file(fileName);

        const [contents] = await file.download();

        return contents.toString();
    } catch (err) {
        console.error(`Erro ao ler o conteúdo do arquivo ${fileName}:`, err);
        return "";
    }
}

async function createAndUploadEmptyJSON(transId) {
    // Create an empty JSON object
    let emptyJSON = [];

    let thisEntry = {
        role: "user",
        message: "Oi, eu sou novo aqui, como voce pode me ajudar?"
    };

    // Append the new object to the existing data
    emptyJSON.push(thisEntry);

    thisEntry = {
        role: "model",
        message: "Oi, estou feliz que voce perguntou! Eu consigo responder perguntas sobre os fontes apresentados."
    };

    // Append the new object to the existing data
    emptyJSON.push(thisEntry);

    // Convert the JSON object to a string
    const jsonString = JSON.stringify(emptyJSON);

    // Set filename
    let fileName = "history_" + transId + ".txt";

    try {
        // Create a new Storage client
        const storage = new Storage();

        let bucketName = configFile.getBucket();

        // Create a new file in the bucket with the name "empty.json"
        const file = storage.bucket(bucketName).file(fileName);

        // Upload the JSON string to the file
        await file.save(jsonString, {
            metadata: {
                contentType: 'application/json',
            },
        });

    } catch (err) {
        console.error(`Erro ao criar o conteúdo do arquivo ${fileName}:`, err);
    }
}

async function appendToJson(transId, userMessage, aiMessage) {
    // Set filename
    let fileName = "history_" + transId + ".txt";

    // Create a new Storage client
    const storage = new Storage();

    let bucketName = configFile.getBucket();

    // Create a reference to the file in the bucket
    const file = storage.bucket(bucketName).file(fileName);

    // Get the existing JSON data from the file
    let [contents] = await file.download();

    let existingData = contents.toString();

    let existingJSON = {};
    try {
        existingJSON = JSON.parse(existingData);
    } catch (err) {
        // File is empty, so initialize with an empty array
        existingJSON = [];
    }

    let thisEntry = {
        role: "user",
        message: userMessage
    }
    // Append the new object to the existing data
    existingJSON.push(thisEntry);

    thisEntry = {
        role: "model",
        message: fileUtils.cleanFile(aiMessage)
    }
    // Append the new object to the existing data
    existingJSON.push(thisEntry);

    // Convert the updated JSON data to a string
    const updatedJSON = JSON.stringify(existingJSON);

    try {
        // Upload the updated JSON string to the file
        await file.save(updatedJSON, {
            metadata: {
                contentType: 'application/json',
            },
        });
    } catch (err) {
        console.error(`Erro ao ler o conteúdo do arquivo ${fileName}:`, err);
    }

}

async function getJSONFileAsObject(transId) {
    // Set filename
    let fileName = "history_" + transId + ".txt";

    try {
        // Create a new Storage client
        const storage = new Storage();

        let bucketName = configFile.getBucket();
        // Create a reference to the file in the bucket
        const file = storage.bucket(bucketName).file(fileName);

        // Get the existing JSON data from the file
        const [contents] = await file.download();

        let existingData = contents.toString();

        // Parse the JSON string into an object
        const jsonObject = JSON.parse(existingData);

        // Return the object
        return jsonObject;
    } catch (err) {
        console.error(`Erro ao ler o conteúdo do arquivo ${fileName}:`, err);
        return null
    }
}

module.exports.uploadToGCS = uploadToGCS;
module.exports.sysinfoExistsSync = sysinfoExistsSync;
module.exports.historyExistsSync = historyExistsSync;
module.exports.getFileContents = getFileContents;
module.exports.createAndUploadEmptyJSON = createAndUploadEmptyJSON;
module.exports.appendToJson = appendToJson;
module.exports.getJSONFileAsObject = getJSONFileAsObject;
