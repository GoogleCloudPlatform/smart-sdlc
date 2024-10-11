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

const { VertexAI } = require('@google-cloud/vertexai');
const gcsUtils = require('../../lib/gcs/gcs');
const configFile = require('../../lib/config/file');
const ctxHelper = require('../../lib/config/ctx');


async function sendCodeMessage(transId, message) {

    // Config
    let projectId = configFile.getAiProject();
    let locationId = configFile.getAiLocation();
    let modelId = configFile.getAiModel();
    let maxOutTokens = Number(configFile.getAiOutputTokens());
    let temperature = Number(configFile.getAiTemperature());
    let maxChatHistory = Number(configFile.getChatHistory()) * 2 * -1;

    // Initialize Vertex with your Cloud project and location
    const vertex_ai = new VertexAI({ project: projectId, location: locationId });

    // Fetch System Instruction and Chat History from Cloud Storage
    const codeCtx = ctxHelper.getCodeContext(); 
    const systemInstruction = codeCtx + await gcsUtils.getFileContents(transId);
    const chatHistory = await gcsUtils.getJSONFileAsObject(transId);

    // Optionally, you can concatenate the chat history to the system instruction
    let completeHistory = [];
    let thisHistory = {};
    if (chatHistory && chatHistory.length > 0) {
        // Get the last 10 entries of chatHistory
        const lastTenEntries = chatHistory.slice(maxChatHistory)
        for (const thisEntry of lastTenEntries) {
            thisHistory = {
                role: thisEntry.role,
                parts: [{
                    text: thisEntry.message
                }]
            }
            completeHistory.push(thisHistory);
        }
    }

    // Instantiate the models
    let generativeModel = vertex_ai.preview.getGenerativeModel({
        model: modelId,
        generationConfig: {
            'maxOutputTokens': maxOutTokens,
            'temperature': temperature,
            'topP': 0.95,
        },
        safetySettings: [
            {
                'category': 'HARM_CATEGORY_HATE_SPEECH',
                'threshold': 'BLOCK_ONLY_HIGH',
            },
            {
                'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
                'threshold': 'BLOCK_ONLY_HIGH',
            },
            {
                'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                'threshold': 'BLOCK_ONLY_HIGH',
            },
            {
                'category': 'HARM_CATEGORY_HARASSMENT',
                'threshold': 'BLOCK_ONLY_HIGH',
            }
        ],
        systemInstruction: {
            parts: [{ "text": systemInstruction }]
        },
    });

    const chat = generativeModel.startChat({
        history: completeHistory
    });

    const streamResult = await chat.sendMessageStream(message);
    let response = (await streamResult.response).candidates[0].content.parts[0].text;

    // Store the messages in Cloud Storage
    await gcsUtils.appendToJson(transId, message, response);

    return response + '\n';

}

async function sendDocMessage(transId, message) {

    // Config
    let projectId = configFile.getAiProject();
    let locationId = configFile.getAiLocation();
    let modelId = configFile.getAiModel();
    let maxOutTokens = Number(configFile.getAiOutputTokens());
    let temperature = Number(configFile.getAiTemperature());
    let maxChatHistory = Number(configFile.getChatHistory()) * 2 * -1;

    // Initialize Vertex with your Cloud project and location
    const vertex_ai = new VertexAI({ project: projectId, location: locationId });

    // Fetch System Instruction and Chat History from Cloud Storage
    const docCtx = ctxHelper.getDocContext();
    const systemInstruction = docCtx + await gcsUtils.getFileContents(transId);
    const chatHistory = await gcsUtils.getJSONFileAsObject(transId);

    // Optionally, you can concatenate the chat history to the system instruction
    let completeHistory = [];
    let thisHistory = {};
    if (chatHistory && chatHistory.length > 0) {
        // Get the last 10 entries of chatHistory
        const lastTenEntries = chatHistory.slice(maxChatHistory)
        for (const thisEntry of lastTenEntries) {
            thisHistory = {
                role: thisEntry.role,
                parts: [{
                    text: thisEntry.message
                }]
            }
            completeHistory.push(thisHistory);
        }
    }

    // Instantiate the models
    let generativeModel = vertex_ai.preview.getGenerativeModel({
        model: modelId,
        generationConfig: {
            'maxOutputTokens': maxOutTokens,
            'temperature': temperature,
            'topP': 0.95,
        },
        safetySettings: [
            {
                'category': 'HARM_CATEGORY_HATE_SPEECH',
                'threshold': 'BLOCK_ONLY_HIGH',
            },
            {
                'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
                'threshold': 'BLOCK_ONLY_HIGH',
            },
            {
                'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                'threshold': 'BLOCK_ONLY_HIGH',
            },
            {
                'category': 'HARM_CATEGORY_HARASSMENT',
                'threshold': 'BLOCK_ONLY_HIGH',
            }
        ],
        systemInstruction: {
            parts: [{ "text": systemInstruction }]
        },
    });

    const chat = generativeModel.startChat({
        history: completeHistory
    });

    const streamResult = await chat.sendMessageStream(message);
    let response = (await streamResult.response).candidates[0].content.parts[0].text;

    // Store the messages in Cloud Storage
    await gcsUtils.appendToJson(transId, message, response);

    return response + '\n';

}

module.exports.sendCodeMessage = sendCodeMessage;
module.exports.sendDocMessage = sendDocMessage;