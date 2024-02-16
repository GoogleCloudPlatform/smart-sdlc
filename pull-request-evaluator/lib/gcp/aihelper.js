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
const configPrompts = require('../config/prompts');
const aiplatform = require('@google-cloud/aiplatform');


/*
 * Builds a request with original file
 * and diff to submit to AI for a
 * risk evaluation
 */
async function diffRank(changeList) {

    let myResponse = "";
    let myInput = "";

    for (const actualFile of changeList) {
        myResponse += actualFile.fileName + ": ";
        myInput += "arquivo original: " + actualFile.fileName;
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.fileContent;
        myInput += "\n########## FIM #########\n\n";
        myInput += "diff: ";
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.fileDiff;
        myInput += "\n########## FIM #########\n\n";


        /* Config Parameters */
        const project = configEnv.getProject();
        const location = configFile.getCodeLocation();
        const model = configFile.getCodeModel();
        const thistemperature = parseFloat(configFile.getCodeTemperature());
        const thismaxtokens = parseFloat(configFile.getCodeMaxtokens());


        /* AI Platform Client */
        const { PredictionServiceClient } = aiplatform.v1;
        const { helpers } = aiplatform;

        /* GRPC Client Config */
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
        const myprompt = configPrompts.getDiffRank();

        /* This is the prompt we're sending to Vertex AI */
        const prompt = {
            context: myprompt,

            messages: [
                {
                    author: 'user',
                    content: myInput,
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
            myResponse += response[0].predictions[0].structValue.fields.candidates.listValue.values[0].structValue.fields.content.stringValue.toString() + "  \n  \n";
        }
        myInput = "";
    }
    return myResponse;
}

/*
 * Builds a request with original file
 * and diff to submit to AI for a
 * simple summarization
 */
async function diffSummary(changeList) {

    let myResponse = "";
    let myInput = "";

    for (const actualFile of changeList) {
        myResponse += actualFile.fileName + ": ";
        myInput += "arquivo original: " + actualFile.fileName;
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.fileContent;
        myInput += "\n########## FIM #########\n\n";
        myInput += "diff: ";
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.fileDiff;
        myInput += "\n########## FIM #########\n\n";


        /* Config Parameters */
        const project = configEnv.getProject();
        const location = configFile.getTextLocation();
        const model = configFile.getTextModel();
        const thistemperature = parseFloat(configFile.getTextTemperature());
        const thismaxtokens = parseFloat(configFile.getTextMaxtokens());


        /* AI Platform Client */
        const { PredictionServiceClient } = aiplatform.v1;
        const { helpers } = aiplatform;

        /* GRPC Client Config */
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
        const myprompt = configPrompts.getDiffSummary();

        /* This is the prompt we're sending to Vertex AI */
        const prompt = {
            prompt: myprompt + "\n" + myInput
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
        myResponse += response[0].predictions[0].structValue.fields.content.stringValue + "  \n  \n";

        myInput = "";

    }
    return myResponse;
}

/*
 * Builds a request all the diffs
 * involved in this Pull Request
 * for summarization
 */
async function prSummary(changeList) {

    let myInput = "";

    for (const actualFile of changeList) {
        myInput += "arquivo: " + actualFile.fileName;
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.fileDiff;
        myInput += "\n########## FIM ##########\n\n";
    }

    /* Config Parameters */
    const project = configEnv.getProject();
    const location = configFile.getTextLocation();
    const model = configFile.getTextModel();
    const thistemperature = parseFloat(configFile.getTextTemperature());
    const thismaxtokens = parseFloat(configFile.getTextMaxtokens());


    /* AI Platform Client */
    const { PredictionServiceClient } = aiplatform.v1;
    const { helpers } = aiplatform;

    /* GRPC Client Config */
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
    const myprompt = configPrompts.getPrSummary();

    /* This is the prompt we're sending to Vertex AI */
    const prompt = {
        prompt: myprompt + "\n" + myInput
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
    return response[0].predictions[0].structValue.fields.content.stringValue;
}

/*
 * Builds a request with all new files
 * that are generated through this PR
 * for summarization
 */
async function fileSummary(changeList) {

    let myResponse = "";
    let myInput = "";

    for (const actualFile of changeList) {
        myResponse += actualFile.fileName + ": ";
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.newContent;
        myInput += "\n########## FIM #########\n\n";


        /* Config Parameters */
        const project = configEnv.getProject();
        const location = configFile.getCodeLocation();
        const model = configFile.getCodeModel();
        const thistemperature = parseFloat(configFile.getCodeTemperature());
        const thismaxtokens = parseFloat(configFile.getCodeMaxtokens());


        /* AI Platform Client */
        const { PredictionServiceClient } = aiplatform.v1;
        const { helpers } = aiplatform;

        /* GRPC Client Config */
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
        const myprompt = configPrompts.getFileSummary();

        /* This is the prompt we're sending to Vertex AI */
        const prompt = {
            context: myprompt,

            messages: [
                {
                    author: 'user',
                    content: myInput,
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
            myResponse += response[0].predictions[0].structValue.fields.candidates.listValue.values[0].structValue.fields.content.stringValue.toString() + "  \n  \n";
        }
        myInput = "";
    }
    return myResponse;
}

/*
 * Builds a request with all new files
 * that are generated through this PR
 * for performance evaluation
 */
async function filePerformance(changeList) {

    let myResponse = "";
    let myInput = "";

    for (const actualFile of changeList) {
        myResponse += actualFile.fileName + ": ";
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.newContent;
        myInput += "\n########## FIM #########\n\n";


        /* Config Parameters */
        const project = configEnv.getProject();
        const location = configFile.getCodeLocation();
        const model = configFile.getCodeModel();
        const thistemperature = parseFloat(configFile.getCodeTemperature());
        const thismaxtokens = parseFloat(configFile.getCodeMaxtokens());


        /* AI Platform Client */
        const { PredictionServiceClient } = aiplatform.v1;
        const { helpers } = aiplatform;

        /* GRPC Client Config */
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
        const myprompt = configPrompts.getFilePerformance();

        /* This is the prompt we're sending to Vertex AI */
        const prompt = {
            context: myprompt,

            messages: [
                {
                    author: 'user',
                    content: myInput,
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
            myResponse += response[0].predictions[0].structValue.fields.candidates.listValue.values[0].structValue.fields.content.stringValue.toString() + "  \n  \n";
        }
        myInput = "";
    }
    return myResponse;
}

/*
 * Builds a request with all new files
 * that are generated through this PR
 * for security evaluation
 */
async function fileSecurity(changeList) {

    let myResponse = "";
    let myInput = "";

    for (const actualFile of changeList) {
        myResponse += actualFile.fileName + ": ";
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.newContent;
        myInput += "\n########## FIM #########\n\n";


        /* Config Parameters */
        const project = configEnv.getProject();
        const location = configFile.getCodeLocation();
        const model = configFile.getCodeModel();
        const thistemperature = parseFloat(configFile.getCodeTemperature());
        const thismaxtokens = parseFloat(configFile.getCodeMaxtokens());


        /* AI Platform Client */
        const { PredictionServiceClient } = aiplatform.v1;
        const { helpers } = aiplatform;

        /* GRPC Client Config */
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
        const myprompt = configPrompts.getFileSecurity();

        /* This is the prompt we're sending to Vertex AI */
        const prompt = {
            context: myprompt,

            messages: [
                {
                    author: 'user',
                    content: myInput,
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
            myResponse += response[0].predictions[0].structValue.fields.candidates.listValue.values[0].structValue.fields.content.stringValue.toString() + "  \n  \n";
        }
        myInput = "";
    }
    return myResponse;
}

module.exports.diffRank = diffRank;
module.exports.diffSummary = diffSummary;
module.exports.prSummary = prSummary;
module.exports.fileSummary = fileSummary;
module.exports.filePerformance = filePerformance;
module.exports.fileSecurity = fileSecurity;