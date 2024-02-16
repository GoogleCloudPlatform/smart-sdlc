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
    for(let thisWiki of wikiList) {
        options += "<option value=\"" + thisWiki.slug + "\">" + thisWiki.title + "</option>\n";
    }
    return options;
}

module.exports.getHtmlOptions = getHtmlOptions;