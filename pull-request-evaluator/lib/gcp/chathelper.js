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
const aiplatform = require('@google-cloud/aiplatform');

async function callPredictText(mycontext, mycontent) {

    /* Config Parameters */
    const project = configEnv.getProject();
    const location = configFile.getTextLocation();
    const model = configFile.getTextModel();
    const thistemperature = parseFloat(configFile.getTextTemperature());
    const thismaxtokens = parseFloat(configFile.getTextMaxtokens());


    /* AI Platform Client */
    const { PredictionServiceClient } = aiplatform.v1;
    const { helpers } = aiplatform;

    /* Vertex Client Options */
    const clientOptions = {
        apiEndpoint: location + '-aiplatform.googleapis.com',
        "grpc.keepalive_timeout_ms": parseInt(configFile.getTextKeepaliveTimeout()),
        "grpc.keepalive_time_ms": parseInt(configFile.getTextKeepaliveTime()),
        "grpc.enable_retries": parseInt(configFile.getTextEnableRetries()),
        "grpc.dns_min_time_between_resolutions_ms": parseInt(configFile.getTextDnsTime()),
        "grpc.initial_reconnect_backoff_ms": parseInt(configFile.getTextInitialBackoff()),
        "grpc.max_reconnect_backoff_ms": parseInt(configFile.getTextMaxBackoff()),
        "grpc.client_idle_timeout_ms": parseInt(configFile.getTextIdleTimeout())
    };

    const publisher = 'google';

    /* Setting up our VertexAI Client */
    const predictionServiceClient = new PredictionServiceClient(clientOptions);
    const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

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

async function callPredictCode(mycontext, mycontent) {

    /* Config Parameters */
    const project = configEnv.getProject();
    const location = configFile.getCodeLocation();
    const model = configFile.getCodeModel();
    const thistemperature = parseFloat(configFile.getCodeTemperature());
    const thismaxtokens = parseFloat(configFile.getCodeMaxtokens());


    /* AI Platform Client */
    const { PredictionServiceClient } = aiplatform.v1;
    const { helpers } = aiplatform;

    /* Vertex Client Options */
    const clientOptions = {
        apiEndpoint: location + '-aiplatform.googleapis.com',
        "grpc.keepalive_timeout_ms": parseInt(configFile.getCodeKeepaliveTimeout()),
        "grpc.keepalive_time_ms": parseInt(configFile.getCodeKeepaliveTime()),
        "grpc.enable_retries": parseInt(configFile.getCodeEnableRetries()),
        "grpc.dns_min_time_between_resolutions_ms": parseInt(configFile.getCodeDnsTime()),
        "grpc.initial_reconnect_backoff_ms": parseInt(configFile.getCodeInitialBackoff()),
        "grpc.max_reconnect_backoff_ms": parseInt(configFile.getCodeMaxBackoff()),
        "grpc.client_idle_timeout_ms": parseInt(configFile.getCodeIdleTimeout())
    };

    const publisher = 'google';

    /* Setting up our VertexAI Client */
    const predictionServiceClient = new PredictionServiceClient(clientOptions);
    const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

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

module.exports.callPredictText = callPredictText;
module.exports.callPredictCode = callPredictCode;