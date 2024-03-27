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
 * Details: Markdown Utilities
 * 
 * Author: Marcelo Parisi (parisim@google.com)
 */

/* list of images from markdown */
async function extractImagesFromMarkdown(markdown) {
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    const matches = markdown.match(regex);

    if (matches) {
        return matches.map((match) => {
            const altText = match.substring(2, match.indexOf(']'));
            const url = match.substring(match.indexOf('(') + 1, match.indexOf(')'));

            return {
                altText,
                url,
            };
        });
    } else {
        return [];
    }
};

/* replace image with text */
async function replaceImagesInMarkdown(markdown, imageName, text) {
    const regex = new RegExp(`!\\[${imageName}\\]\\((.*?)\\)`, 'g');
    return markdown.replaceAll(regex, text).toString();
};

/* check if there are any images on markdown */
async function checkImagesOnMarkdown(markdown) {
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    const matches = markdown.match(regex);

    if (matches) {
        return true;
    } else {
        return false;
    }
}

module.exports.extractImagesFromMarkdown = extractImagesFromMarkdown;
module.exports.replaceImagesInMarkdown = replaceImagesInMarkdown;
module.exports.checkImagesOnMarkdown = checkImagesOnMarkdown;