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
 * script-playwright
 * Gerador de Script de Testes Playwright
 * Details: GCP Vertex AI Helper Functions
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const configEnv = require('../config/env');
const configFile = require('../config/file');
const contextFile = require('../config/ctx');
const aiplatform = require('@google-cloud/aiplatform');

async function callPredict(mycontent) {

    /* Config Parameters */
    const project = configEnv.getProject();
    const location = configFile.getLocation();
    const model = configFile.getModel();
    const thistemperature = parseFloat(configFile.getTemperature());
    const thismaxtokens = parseFloat(configFile.getMaxtokens());


    /* AI Platform Client */
    const { PredictionServiceClient } = aiplatform.v1;
    const { helpers } = aiplatform;
    /* Vertex Client Options */
    const clientOptions = {
        apiEndpoint: location + '-aiplatform.googleapis.com',
        "grpc.keepalive_timeout_ms": parseInt(configFile.getKeepaliveTimeout()),
        "grpc.keepalive_time_ms": parseInt(configFile.getKeepaliveTime()),
        "grpc.enable_retries": parseInt(configFile.getEnableRetries()),
        "grpc.dns_min_time_between_resolutions_ms": parseInt(configFile.getDnsTime()),
        "grpc.initial_reconnect_backoff_ms": parseInt(configFile.getInitialBackoff()),
        "grpc.max_reconnect_backoff_ms": parseInt(configFile.getMaxBackoff()),
        "grpc.client_idle_timeout_ms": parseInt(configFile.getIdleTimeout())
    };

    const publisher = 'google';

    /* Setting up our VertexAI Client */
    const predictionServiceClient = new PredictionServiceClient(clientOptions);
    const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;
    const mycontext = contextFile.getContext();

    /* This is the prompt we're sending to Vertex AI */
    const prompt = {
        context: mycontext,

        messages: [
            {
                author: 'user',
                content: mycontent,
            },
        ],
    };
    const instanceValue = helpers.toValue(prompt);
    const instances = [instanceValue];

    /* Vertex AI Model parameters */
    const parameter = {
        maxResponses: 1,
        candidateCount: 1,
        temperature: thistemperature,
        maxOutputTokens: thismaxtokens,
        topP: 1,
        topK: 0,
    };
    const parameters = helpers.toValue(parameter);

    /* Setting up our Request */
    const request = {
        endpoint,
        instances,
        parameters,
    };

    /* Setting Call Retry Options */
    let predictOptions = {
        retry: configFile.getGrpcRetry(),
        maxRetries: parseInt(configFile.getGrpcMaxRetries()),
        timeout: parseInt(configFile.getGrpcTimeout()),
        retryRequestOptions: {
            maxRetryDelay: 500000,
            retries: parseInt(configFile.getGrpcMaxRetries()),
            retryDelayMultiplier: 1000
        }
    };

    /* Send Request to Vertex AI */
    const response = await predictionServiceClient.predict(request, predictOptions);
    if (response[0].predictions[0].structValue.fields.candidates.listValue.values[0].structValue.fields.content.stringValue != "") {
        return response[0].predictions[0].structValue.fields.candidates.listValue.values[0].structValue.fields.content.stringValue.toString();
    } else {
        return "";
    }
}

module.exports.callPredict = callPredict;