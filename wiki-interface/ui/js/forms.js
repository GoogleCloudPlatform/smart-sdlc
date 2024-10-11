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

/* User Story Call */
async function sendUsData() {
    let modelId = document.getElementById('inputModelId').value;
    let documentId = document.getElementById('inputDocumentId').value;

    let documentExists = await checkDocument(documentId, "evaluator");

    if (documentExists) {
        alert("Target document already exists!")
    } else {

        document.getElementById("main-content").style.display = "none";
        document.getElementById("loading").style.display = "block";

        const data = {
            modelId: modelId,
            documentId: documentId
        };

        fetch('/api/v1/userstory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                let renderedHTML = marked.parse(sanitizedResponse, { breaks: true });
                document.getElementById('ratingContent').innerHTML = renderedHTML;
                document.getElementById('ratingTransactionId').value = responseData.transactionId;
                document.getElementById('ratingDocumentId').value = responseData.documentId;
                document.getElementById('ratingPagePath').value = responseData.pagePath;
                document.getElementById('ratingMimeType').value = "markdown";
                document.getElementById('ratingPageContent').value = responseData.pageContent;
                document.getElementById("loading").style.display = "none";
                document.getElementById("rating-content").style.display = "block";
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                // Handle errors here (e.g., display an error message to the user)
            });
    }

}

/* Test Case Call */
async function sendTcData() {
    let modelId = document.getElementById('inputModelId').value;
    let documentId = document.getElementById('inputDocumentId').value;

    let documentExists = await checkDocument(documentId, "testcase");

    if (documentExists) {
        alert("Target document already exists!")
    } else {

        document.getElementById("main-content").style.display = "none";
        document.getElementById("loading").style.display = "block";

        const data = {
            modelId: modelId,
            documentId: documentId
        };

        fetch('/api/v1/testcase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                let renderedHTML = marked.parse(sanitizedResponse, { breaks: true });
                document.getElementById('ratingContent').innerHTML = renderedHTML;
                document.getElementById('ratingTransactionId').value = responseData.transactionId;
                document.getElementById('ratingDocumentId').value = responseData.documentId;
                document.getElementById('ratingPagePath').value = responseData.pagePath;
                document.getElementById('ratingMimeType').value = "markdown";
                document.getElementById('ratingPageContent').value = responseData.pageContent;
                document.getElementById("loading").style.display = "none";
                document.getElementById("rating-content").style.display = "block";
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                // Handle errors here (e.g., display an error message to the user)
            });
    }
}

/* Test Script Call */
async function sendTsData() {
    let modelId = document.getElementById('inputModelId').value;
    let documentId = document.getElementById('inputDocumentId').value;
    let documentExists = await checkDocument(documentId, modelId);

    if (documentExists) {
        alert("Target document already exists!")
    } else {

        document.getElementById("main-content").style.display = "none";
        document.getElementById("loading").style.display = "block";

        let url = "";

        switch (modelId) {
            case "script-cypress":
                url = "/api/v1/cypress";
                break;
            case "script-playwright":
                url = "/api/v1/playwright";
                break;
            case "script-selenium":
                url = "/api/v1/selenium";
                break;
            default:
                url = "/api/v1/cypress";
                break;
        }
        const data = {
            documentId: documentId
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                let renderedHTML = marked.parse(sanitizedResponse, { breaks: true });
                document.getElementById('ratingContent').innerHTML = renderedHTML;
                document.getElementById('ratingTransactionId').value = responseData.transactionId;
                document.getElementById('ratingDocumentId').value = responseData.documentId;
                document.getElementById('ratingPagePath').value = responseData.pagePath;
                document.getElementById('ratingMimeType').value = "javascript";
                document.getElementById('ratingPageContent').value = responseData.pageContent;
                document.getElementById("loading").style.display = "none";
                document.getElementById("rating-content").style.display = "block";
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                // Handle errors here (e.g., display an error message to the user)
            });
    }
}

/* Test Data Call */
function sendSampleData() {
    let modelId = document.getElementById('inputModelId').value;
    let documentId = document.getElementById('inputDocumentId').value;
    let dataSampleQty = document.getElementById('inputDataSampleQty').value;

    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    const data = {
        modelId: modelId,
        documentId: documentId,
        sampleQty: dataSampleQty
    };


    fetch('/api/v1/testdata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingContent').innerHTML = "<textarea rows=30 cols=180>\n" + responseData.pageContent + "\n</textarea>\n";
            document.getElementById('ratingMimeType').value = "text";
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* Code Search Call */
function sendCodeSearchData() {
    let userQuery = document.getElementById('userQuery').value;

    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    const data = {
        userQuery: userQuery
    };


    fetch('/api/v1/codesearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            let renderedHTML = marked.parse(sanitizedResponse, { breaks: true });
            document.getElementById('ratingContent').innerHTML = renderedHTML;
            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingMimeType').value = "markdown";
            document.getElementById('ratingContent').innerHTML = renderedHTML;
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* Code Search Call */
function sendSolutionOverview() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch('/api/v1/solutionoverview', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            let mermaidDiagram = responseData.pageContent.match(/```mermaid\n(.*?)\n```/gs, (match, mermaidCode) => {
                return `${mermaidCode.trim().toString()}`;
            });

            let renderedHTML = marked.parse(responseData.pageContent, { breaks: true })
            if (mermaidDiagram !== null && mermaidDiagram !== undefined && mermaidDiagram.length > 0) {
                let modifiedMessage = mermaidDiagram.toString().replace(/```mermaid\n(.*?)\n```/gs, (match, mermaidCode) => {
                    return `<div class="mermaid">${mermaidCode.trim()}</div>`;
                });

                const parser = new DOMParser();
                const doc = parser.parseFromString(renderedHTML, 'text/html');

                const codeElements = doc.querySelectorAll('code.language-mermaid');

                codeElements.forEach(codeElement => {
                    const newElement = parser.parseFromString(modifiedMessage, 'text/html').body.firstChild; //Parse testString into a node
                    if (!newElement) {
                        console.error("Error: Test string did not parse correctly. Is it valid HTML?")
                    }
                    codeElement.replaceWith(newElement);
                });


                document.getElementById('ratingContent').innerHTML = doc.body.innerHTML;

                setTimeout(() => { //Added a small delay
                    mermaid.init(); // Or mermaidAPI.render if using that approach.
                }, 5000); // Adjust the delay (in milliseconds) as needed

            } else {
                document.getElementById('ratingContent').innerHTML = renderedHTML;
            }

            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingMimeType').value = "markdown";
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* Code Search Call */
function sendSolutionDatabase() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch('/api/v1/solutiondatabase', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            let mermaidDiagram = responseData.pageContent.match(/```mermaid\n(.*?)\n```/gs, (match, mermaidCode) => {
                return `${mermaidCode.trim().toString()}`;
            });

            let renderedHTML = marked.parse(responseData.pageContent, { breaks: true })
            if (mermaidDiagram !== null && mermaidDiagram !== undefined && mermaidDiagram.length > 0) {
                let modifiedMessage = mermaidDiagram.toString().replace(/```mermaid\n(.*?)\n```/gs, (match, mermaidCode) => {
                    return `<div class="mermaid">${mermaidCode.trim()}</div>`;
                });

                const parser = new DOMParser();
                const doc = parser.parseFromString(renderedHTML, 'text/html');

                const codeElements = doc.querySelectorAll('code.language-mermaid');

                codeElements.forEach(codeElement => {
                    const newElement = parser.parseFromString(modifiedMessage, 'text/html').body.firstChild; //Parse testString into a node
                    if (!newElement) {
                        console.error("Error: Test string did not parse correctly. Is it valid HTML?")
                    }
                    codeElement.replaceWith(newElement);
                });


                document.getElementById('ratingContent').innerHTML = doc.body.innerHTML;

                setTimeout(() => { //Added a small delay
                    mermaid.init(); // Or mermaidAPI.render if using that approach.
                }, 5000); // Adjust the delay (in milliseconds) as needed

            } else {
                document.getElementById('ratingContent').innerHTML = renderedHTML;
            }

            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingMimeType').value = "markdown";
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* Code Search Call */
function sendSolutionAPI() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch('/api/v1/solutionapi', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            let renderedHTML = marked.parse(sanitizedResponse, { breaks: true })
            document.getElementById('ratingContent').innerHTML = renderedHTML;
            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingMimeType').value = "markdown";
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* Code Search Call */
function sendSolutionDep() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch('/api/v1/solutiondep', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            let renderedHTML = marked.parse(sanitizedResponse, { breaks: true })
            document.getElementById('ratingContent').innerHTML = renderedHTML;
            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingMimeType').value = "markdown";
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* Code Search Call */
function sendSolutionIntegration() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch('/api/v1/solutionintegration', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            let renderedHTML = marked.parse(sanitizedResponse, { breaks: true })
            document.getElementById('ratingContent').innerHTML = renderedHTML;
            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingMimeType').value = "markdown";
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* Code Search Call */
function sendSolutionSecurity() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    fetch('/api/v1/solutionsecurity', {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            let sanitizedResponse = responseData.pageContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            let renderedHTML = marked.parse(sanitizedResponse, { breaks: true })
            document.getElementById('ratingContent').innerHTML = renderedHTML;
            document.getElementById('ratingTransactionId').value = responseData.transactionId;
            document.getElementById('ratingDocumentId').value = responseData.documentId;
            document.getElementById('ratingPagePath').value = responseData.pagePath;
            document.getElementById('ratingPageContent').value = responseData.pageContent;
            document.getElementById('ratingMimeType').value = "markdown";
            document.getElementById("loading").style.display = "none";
            document.getElementById("rating-content").style.display = "block";
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

function sendRatingData() {
    let ratingValue = document.getElementById('rating').value;
    let ratingTransactionId = document.getElementById('ratingTransactionId').value;
    let ratingPagePath = document.getElementById('ratingPagePath').value;
    let ratingDocumentId = document.getElementById('ratingDocumentId').value;
    let ratingPageContent = document.getElementById('ratingPageContent').value;

    document.getElementById("main-content").style.display = "none";
    document.getElementById("rating-content").style.display = "none";
    document.getElementById("loading").style.display = "block";

    const data = {
        documentId: ratingDocumentId,
        documentContent: ratingPageContent,
        documentPath: ratingPagePath,
        transactionId: ratingTransactionId,
        ratingValue: ratingValue
    };

    fetch('/api/v1/rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            // Construct the redirect URL
            const redirectUrl = `/ui/`;

            window.location.href = redirectUrl;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle errors here (e.g., display an error message to the user)
        });
}

/* sample qty */
function showQtd() {
    rating = document.getElementById('inputDataSampleQty').value;
    document.getElementById('sampleqty').innerHTML = rating.toString();
}

/* show rating */
function showRating() {
    rating = document.getElementById('rating').value;
    document.getElementById('ratevalue').innerHTML = rating.toString();
}

/* Check if document exists */
async function checkDocument(documentId, modelId) {
    const data = {
        documentId: documentId,
        modelId: modelId
    };
    try {
        const response = await fetch('/api/v1/checkdocument', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors here (e.g., display an error message to the user)
        return null; // or some default value or error representation
    }
}

