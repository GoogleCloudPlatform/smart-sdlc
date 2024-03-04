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
 * pull-request-evaluator
 * Pull Request Evaluator
 * Details: GCP Vertex AI Helper Functions
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const configEnv = require('../config/env');
const configFile = require('../config/file');
const {VertexAI} = require('@google-cloud/vertexai');

async function callPredictText(mycontext, mycontent) {

    /* Config Parameters */
    const project = configEnv.getProject();
    const location = configFile.getTextLocation();
    const model = configFile.getTextModel();
    const thistemperature = parseFloat(configFile.getTextTemperature());
    const thismaxtokens = parseFloat(configFile.getTextMaxtokens());

    const vertex_ai = new VertexAI({
        project: project,
        location: location
    });

    // Instantiate the models
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generation_config: {
            "max_output_tokens": thismaxtokens,
            "temperature": thistemperature,
            "top_p": 1
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
    });

    /* Building our request */
    const req = {
        contents: [{role: 'user', parts: [{text: mycontext + "\n\n" + mycontent}]}],
    };
    
    const streamingResp = await generativeModel.generateContentStream(req);

    const response = await streamingResp.response;
    
    if(response.candidates[0].content.parts[0].text != "") {
        return response.candidates[0].content.parts[0].text;
    } else {
        return "";
    }
}

async function callPredictCode(mycontext, mycontent) {

    /* Config Parameters */
    const project = configEnv.getProject();
    const location = configFile.getCodeLocation();
    const model = configFile.getCodeModel();
    const thistemperature = parseFloat(configFile.getCodeTemperature());
    const thismaxtokens = parseFloat(configFile.getCodeMaxtokens());

    const vertex_ai = new VertexAI({
        project: project,
        location: location
    });

    // Instantiate the models
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generation_config: {
            "max_output_tokens": thismaxtokens,
            "temperature": thistemperature,
            "top_p": 1
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
    });

    /* Building our request */
    const req = {
        contents: [{role: 'user', parts: [{text: mycontext + "\n\n" + mycontent}]}],
    };
    
    const streamingResp = await generativeModel.generateContentStream(req);

    const response = await streamingResp.response;
    
    if(response.candidates[0].content.parts[0].text != "") {
        return response.candidates[0].content.parts[0].text;
    } else {
        return "";
    }
}

module.exports.callPredictText = callPredictText;
module.exports.callPredictCode = callPredictCode;