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
 * Details: Convert list to options
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

/* build an HTML list from wiki list */
function getHtmlOptions(wikiList) {

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
        options += "<option value=\"" + thisWiki.slug + "\">" + thisWiki.title + "</option>\n";
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
function generateHtmlForm(projectId, myHtmlOptions) {
    let myresponse = `
         <!DOCTYPE html>
         <html>
         <head>
         <meta http-equiv="cache-control" content="max-age=0; no-cache" />
         <meta http-equiv="expires" content="0" />
         <meta http-equiv="pragma" content="no-cache" />
         <title>GenAI Dashboard</title>
         <script>
         function sendData() {
             document.getElementById("inputdoc").disabled = true;
             document.getElementById("aialgo").disabled = true;
             document.getElementById("processar").disabled = true;
             document.getElementById("reset").disabled = true;
             document.getElementById("inputdata").style.display = "none";
             document.getElementById("loading").style.display = "block";
             window.location.href = "/process/" + document.getElementById('aialgo').value + "/" + document.getElementById('project').value + "/" + document.getElementById('inputdoc').value;
         }
         </script>
         </head>
         <body>
         <br>
         <h2>GenAI Dashboard</h2>
         <h4>
            <font color="red"><b>Atenção:</b></font>&nbsp;Para os geradores de documento e script, o item de destino do Wiki não pode existir!<br />
            <font color="red"><b>Warning:</b></font>&nbsp;For documents and scripts generator, the destination item must not exist in Wiki!<br />
        </h4>
         <div id="inputdata">
             <br />
             <input type="hidden" name="project" id="project" value="${projectId}" />
         
             <label for="inputdoc">Select Document / Selecione o Documento:</label>
             <select name="inputdoc" id="inputdoc">
                 ${myHtmlOptions}
             </select>
             <br />
             <br />
             <label for="aialgo">Select Model / Selecione o Modelo</label>&nbsp;
             <select name="aialgo" id="aialgo">
             <option value="eval">&nbsp;&nbsp;Avaliar Estória do Usuário&nbsp;/&nbsp;Evaluate User Story&nbsp;&nbsp;&nbsp;&nbsp;</option>
             <option value="document">&nbsp;&nbsp;Gerador de Casos de Testes&nbsp;/&nbsp;Generate Test Case&nbsp;&nbsp;&nbsp;&nbsp;</option>
             <option value="cypress">&nbsp;&nbsp;Gerador de Script em Cypress&nbsp;/&nbsp;Generate Cypress Script&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
             <option value="playwright">&nbsp;&nbsp;Gerador de Script em Playwright&nbsp;/&nbsp;Generate Playwright Script&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
             </select>
             <br />
             <br />
             <button id="processar" onclick="sendData()">Processar / Process</button>
             &nbsp;&nbsp;
             <input type="reset" id="reset" name="reset" value="&nbsp;&nbsp;Reset&nbsp;&nbsp;">
             <br />&nbsp;<br />
             <a href="javascript:history.back()">Go Back</a>
         </div>
         <br />
         <div id="loading" style="display: none">
             <center>
             <img src="/img/loading.gif" border="0" width="180" height="180"> <br />
             </center>
         </div>
         <br />
         </body>
         </html>
    `;

    return myresponse;
}

module.exports.getHtmlOptions = getHtmlOptions;
module.exports.generateRefreshPage = generateRefreshPage;
module.exports.generateHtmlForm = generateHtmlForm;