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
const configFile = require('../config/file');
const contextFile = require('../config/ctx');
const {VertexAI} = require('@google-cloud/vertexai');

async function callPredict(codeBase) {
    /* Load config */
    let projectId = configEnv.getProject();
    let locationId = configFile.getLocation();
    let modelId = configFile.getModel();
    let temperature = parseFloat(configFile.getTemperature());
    let maxOutTokens = parseFloat(configFile.getMaxtokens());
  
    /* Initialize Vertex */
    const vertex_ai = new VertexAI({ project: projectId, location: locationId });
  
    /* System Information and History */
    const systemInstruction = contextFile.getMainContext() + codeBase;
    let completeHistory = [];
  
    /* Initialize Model */
    let generativeModel = vertex_ai.preview.getGenerativeModel({
      model: modelId,
      generationConfig: {
        'maxOutputTokens': maxOutTokens,
        'temperature': temperature,
        'topP': 0.95,
      },
      safety_settings: [
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_ONLY_HIGH"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_ONLY_HIGH"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
    ],
      systemInstruction: {
        parts: [{ "text": systemInstruction }]
      },
    });
  
    const chat = generativeModel.startChat({ history: completeHistory });

    /* Overview Message */
    let firstMessage = contextFile.getOverviewContext() + codeBase;
    let streamResult = await chat.sendMessageStream(firstMessage);
    let currentResponse = (await streamResult.response).candidates[0].content.parts[0].text;
    completeHistory.push({content: firstMessage, role: "user"});
    completeHistory.push({content: currentResponse, role: "assistant"});
  
    /* return summary */
    return currentResponse;
  }

module.exports.callPredict = callPredict;