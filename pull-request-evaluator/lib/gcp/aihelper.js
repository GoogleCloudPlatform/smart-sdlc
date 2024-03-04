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

const configFile = require('../config/file');
const configPrompts = require('../config/prompts');
const gcpAiPlatformText = require('../../lib/gcp/texthelper');
const gcpAiPlatformChat = require('../../lib/gcp/chathelper');
const gcpAiPlatformGemini = require('../../lib/gcp/geminihelper');

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

        const model = configFile.getCodeModel();
        const myprompt = configPrompts.getDiffRank();

        if(model.includes("code-bison") || model.includes("text-bison")) {
            myResponse += await gcpAiPlatformText.callPredictCode(myprompt, myInput);
        } else if(model.includes("codechat-bison") || model.includes("chat-bison")) {
            myResponse += await gcpAiPlatformChat.callPredictCode(myprompt, myInput);
        } else if(model.includes("gemini")) {
            myResponse += await gcpAiPlatformGemini.callPredictCode(myprompt, myInput);
        }

        myResponse += "  \n";
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

        const model = configFile.getTextModel();
        const myprompt = configPrompts.getDiffSummary();

        if(model.includes("text-bison") || model.includes("code-bison")) {
            myResponse += await gcpAiPlatformText.callPredictText(myprompt, myInput);
        } else if(model.includes("chat-bison") || model.includes("codechat-bison")) {
            myResponse += await gcpAiPlatformChat.callPredictText(myprompt, myInput);
        } else if(model.includes("gemini")) {
            myResponse += await gcpAiPlatformGemini.callPredictText(myprompt, myInput);
        }

        myResponse += "  \n";
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
    let response = "";

    for (const actualFile of changeList) {
        myInput += "arquivo: " + actualFile.fileName;
        myInput += "\n########## INICIO #########\n\n";
        myInput += actualFile.fileDiff;
        myInput += "\n########## FIM ##########\n\n";
    }

    const model = configFile.getCodeModel();
    const myprompt = configPrompts.getPrSummary();

    if(model.includes("code-bison") || model.includes("text-bison")) {
        response = await gcpAiPlatformText.callPredictCode(myprompt, myInput);
    } else if(model.includes("codechat-bison") || model.includes("chat-bison")) {
        response = await gcpAiPlatformChat.callPredictCode(myprompt, myInput);
    } else if(model.includes("gemini")) {
        response = await gcpAiPlatformGemini.callPredictCode(myprompt, myInput);
    }
    
    return response;
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

        const model = configFile.getCodeModel();
        const myprompt = configPrompts.getFileSummary();

        if(model.includes("code-bison") || model.includes("text-bison")) {
            myResponse += await gcpAiPlatformText.callPredictCode(myprompt, myInput);
        } else if(model.includes("codechat-bison") || model.includes("chat-bison")) {
            myResponse += await gcpAiPlatformChat.callPredictCode(myprompt, myInput);
        } else if(model.includes("gemini")) {
            myResponse += await gcpAiPlatformGemini.callPredictCode(myprompt, myInput);
        }
        
        myResponse += "  \n";
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

        const model = configFile.getCodeModel();
        const myprompt = configPrompts.getFilePerformance();

        if(model.includes("code-bison") || model.includes("text-bison")) {
            myResponse += await gcpAiPlatformText.callPredictCode(myprompt, myInput);
        } else if(model.includes("codechat-bison") || model.includes("chat-bison")) {
            myResponse += await gcpAiPlatformChat.callPredictCode(myprompt, myInput);
        } else if(model.includes("gemini")) {
            myResponse += await gcpAiPlatformGemini.callPredictCode(myprompt, myInput);
        }

        myResponse += "  \n";
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

        const model = configFile.getCodeModel();
        const myprompt = configPrompts.getFileSecurity();

        if(model.includes("code-bison") || model.includes("text-bison")) {
            myResponse += await gcpAiPlatformText.callPredictCode(myprompt, myInput);
        } else if(model.includes("codechat-bison") || model.includes("chat-bison")) {
            myResponse += await gcpAiPlatformChat.callPredictCode(myprompt, myInput); 
        } else if(model.includes("gemini")) {
            myResponse += await gcpAiPlatformGemini.callPredictCode(myprompt, myInput);
        }

        myResponse += "  \n";
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