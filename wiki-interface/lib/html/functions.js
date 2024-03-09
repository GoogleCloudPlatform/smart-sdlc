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
 * wiki-interface
 * Interface com Gitlab Wiki
 * Details: HTML content
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

const fs = require('node:fs');
const configFile = require('../../lib/config/file');

/* build an HTML list for User Stories */
function getHtmlUsOptions(wikiList) {

    let options = "";

    /* Sorting Data */
    wikiList = wikiList.sort(function(a,b){
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if(x>y){return 1;}
        if(x<y){return -1;}
        return 0;
    });

    for(let thisWiki of wikiList) {
        if(!thisWiki.title.includes(configFile.getGeneratorsufix()) && !thisWiki.title.includes(configFile.getCypresssufix) && 
           !thisWiki.title.includes(configFile.getPlaywrightsufix) && !thisWiki.title.includes(configFile.getEvaluatorsufix)) {
            options += "<option value=\"" + thisWiki.slug + "\">" + thisWiki.title + "</option>\n";
        }
    }
    return options;
}

/* build an HTML list for User Stories */
function getHtmlTcOptions(wikiList) {

    let options = "";

    /* Sorting Data */
    wikiList = wikiList.sort(function(a,b){
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if(x>y){return 1;}
        if(x<y){return -1;}
        return 0;
    });

    for(let thisWiki of wikiList) {
        if(!thisWiki.title.includes(configFile.getGeneratorsufix()) && !thisWiki.title.includes(configFile.getCypresssufix) && 
           !thisWiki.title.includes(configFile.getPlaywrightsufix) && !thisWiki.title.includes(configFile.getEvaluatorsufix)) {
            options += "<option value=\"" + thisWiki.slug + "\">" + thisWiki.title + "</option>\n";
        }
    }
    return options;
}

/* build an HTML list for Test Cases */
function getHtmlTsOptions(wikiList) {

    let options = "";

    /* Sorting Data */
    wikiList = wikiList.sort(function(a,b){
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if(x>y){return 1;}
        if(x<y){return -1;}
        return 0;
    });

    for(let thisWiki of wikiList) {
        if(thisWiki.title.includes(configFile.getGeneratorsufix())) {
            options += "<option value=\"" + thisWiki.slug + "\">" + thisWiki.title + "</option>\n";
        }
    }
    return options;
}

/* build refresh page */
function generateRefreshPage(refreshUrl) {
    let refreshContent = `
         <!DOCTYPE html>
         <html xmlns="http://www.w3.org/1999/xhtml">    
         <head>
             <meta http-equiv="cache-control" content="max-age=0; no-cache" />
             <meta http-equiv="expires" content="0" />
             <meta http-equiv="pragma" content="no-cache" />
             <meta http-equiv="refresh" content="2;URL='${refreshUrl}'" />    
         </head>    
         <body>
         </body>  
         </html> 
    `;

    return refreshContent;
}

/* build HTML form */
function generateHtmlForm(projectId, wikiList) {
    let usOptions = getHtmlUsOptions(wikiList);
    let tcOptions = getHtmlTcOptions(wikiList);
    let tsOptions = getHtmlTsOptions(wikiList);

    let filename  = "templates/mainform_" + configFile.getLanguage() + ".html";
    let mycontent = fs.readFileSync(filename, 'utf8');

    mycontent = mycontent.replace("__PROJECT-ID__", projectId);
    mycontent = mycontent.replace("__US-INPUT-DOCS__", usOptions);
    mycontent = mycontent.replace("__TC-INPUT-DOCS__", tcOptions);
    mycontent = mycontent.replace("__TS-INPUT-DOCS__", tsOptions);

    return mycontent;
}

/* build rating page */
function generateRatingPage(id, content, projectId, document) {
    let filename  = "templates/ratingform_" + configFile.getLanguage() + ".html";
    let mycontent = fs.readFileSync(filename, 'utf8');

    mycontent = mycontent.replace("__PROJECT-ID__", projectId);
    mycontent = mycontent.replace("__DOC-CONTENTS__", content);
    mycontent = mycontent.replace("__DOCUMENT__", document);
    mycontent = mycontent.replace("__TRANSACTION-ID__", id);

    return mycontent;
}

module.exports.generateRefreshPage = generateRefreshPage;
module.exports.generateHtmlForm = generateHtmlForm;
module.exports.generateRatingPage = generateRatingPage;