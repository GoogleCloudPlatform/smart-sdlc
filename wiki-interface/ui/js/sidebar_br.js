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


let isChatbotTyping = false;
let typingIntervalId = null;
let typingIndicatorMessage = 'Digitando';

function loadMainContent(page) {
    const mainContentDiv = document.getElementById("main-content");
    const loadingDiv = document.getElementById("loading");
    const ratingDiv = document.getElementById("rating-content")
    let url = "";

    switch (page) {
        case "about":
            url = "/ui/about";
            break;
        case "userstory":
            url = "/ui/userstory";
            break;
        case "testcase":
            url = "/ui/testcase";
            break;
        case "testscript":
            url = "/ui/testscript";
            break;
        case "testdata":
            url = "/ui/testdata";
            break;
        case "codechatbot":
            url = "/ui/codechatbot";
            break;
        case "docchatbot":
            url = "/ui/docchatbot";
            break;
        case "codesearch":
            url = "/ui/codesearch";
            break;
        case "solutionoverview":
            url = "/ui/solutionoverview";
            break;
        case "solutiondatabase":
            url = "/ui/solutiondatabase";
            break;
        case "solutionapi":
            url = "/ui/solutionapi";
            break;
        case "solutiondep":
            url = "/ui/solutiondep";
            break;
        case "solutionintegration":
            url = "/ui/solutionintegration";
            break;
        case "solutionsecurity":
            url = "/ui/solutionsecurity";
            break;
        case "selectproject":
            url = "/ui/selectproject";
            break;
        default:
            url = "/ui/about";
            break;
    }

    mainContentDiv.style.display = "none";
    ratingDiv.style.display = "none";
    loadingDiv.style.display = "block";

    /* Fetch the HTML content from the specified URL */
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(htmlContent => {
            /* Update the innerHTML of the div with the loaded content */
            mainContentDiv.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error("Error loading HTML:", error);
            mainContentDiv.innerHTML = "<p>Failed to load content. Please try again later.</p>";
        });

    waitContentLoad(() => {
        loadingDiv.style.display = "none";
        mainContentDiv.style.display = "block";

        /* If we're on chatbots, we'll wait for the sessions on GCS */
        if (page == "codechatbot" || page == "docchatbot") {
            checkReady();
        } else {
            if (page == "userstory" || page == "testcase" || page == "testscript") {
                fetchAndPopulateSelect(page);
            } else if (page == "selectproject") {
                loadProjectList();
            }
        }
    });
}

function loadProjectList() {
    fetch("/api/v1/projects")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const selectElement = document.getElementById("projectSelector");

            // Clear existing options (optional)
            selectElement.innerHTML = '';

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.projectId;
                option.text = item.projectName;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

}

function setProject() {
    // Get the selected project value from the dropdown
    const selectedProject = document.getElementById("projectSelector").value;

    // Construct the redirect URL
    const redirectUrl = `/ui/setproject/${selectedProject}`;

    window.location.href = redirectUrl;
}

function fetchAndPopulateSelect(type) {

    switch (type) {
        case "userstory":
            url = "/api/v1/userstoryoptions";
            break;
        case "testcase":
            url = "/api/v1/testcaseoptions";
            break;
        case "testscript":
            url = "/api/v1/testscriptoptions";
            break;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const selectElement = document.getElementById("inputDocumentId");

            // Clear existing options (optional)
            selectElement.innerHTML = '';

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.value; // Assuming your JSON has a 'value' property
                option.text = item.label || item.value; // Use 'label' property if available, otherwise use 'value'
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}


function displayUserMessage(message) {
    let chatBody = document.getElementById('chat-body');
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerText = message;
    chatBody.appendChild(userMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayChatbotMessage(message) {
    let chatBody = document.getElementById('chat-body');
    if (isChatbotTyping) {
        // Remove the typing indicator when bot responds
        clearInterval(typingIntervalId);
        const typingIndicator = chatBody.querySelector('.typing-indicator');
        if (typingIndicator) {
            chatBody.removeChild(typingIndicator);
        }
        isChatbotTyping = false;
    }

    const chatbotMessage = document.createElement('div');
    chatbotMessage.className = 'chatbot-message';

    let modifiedMessage = message.replace(/```mermaid\n(.*?)\n```/gs, (match, mermaidCode) => {
        const mermaidContainer = document.createElement('div');
        mermaidContainer.classList.add('mermaid'); // Give it a class for mermaid.init() to find
        mermaidContainer.innerHTML = mermaidCode.trim(); // Trim any extra whitespace
        return mermaidContainer.outerHTML; // Replace the code block with the rendered HTML
    });

    let renderedHTML = marked.parse(modifiedMessage);
    chatbotMessage.innerHTML = renderedHTML;
    chatBody.appendChild(chatbotMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
    mermaid.init();
}

function displayTypingIndicator() {
    let chatBody = document.getElementById('chat-body');
    if (!isChatbotTyping) {
        // Create the typing indicator as a chatbot message
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message typing-indicator';
        typingIndicator.innerText = typingIndicatorMessage;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        isChatbotTyping = true;

        // Start the interval to cycle the typing indicator message
        typingIntervalId = setInterval(() => {
            if (typingIndicatorMessage === 'Digitando...') {
                typingIndicatorMessage = 'Digitando';
            } else {
                typingIndicatorMessage += '.';
            }
            typingIndicator.innerText = typingIndicatorMessage;
        }, 400);
    }
}

async function sendMessage() {
    let userInput = document.getElementById('user-input');
    let chatbotType = document.getElementById('bot-type').value;

    let url = "";

    switch (chatbotType) {
        case "code":
            url = "/api/v1/codemessage"
            break;
        case "doc":
            url = "/api/v1/docmessage"
            break
    }

    // Ignore empty messages
    const message = userInput.value.trim();
    if (message === '') {
        return;
    }
    displayUserMessage(message);

    userInput.value = '';

    try {
        // Display the typing indicator while waiting for the OpenAI's response
        displayTypingIndicator();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
            console.log(response.status);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const chatbotResponse = data.message;
        displayChatbotMessage(chatbotResponse);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function checkReady() {
    try {
        displayChatbotMessage("Estou me preparando...");
        // Display the typing indicator while waiting for the OpenAI's response
        displayTypingIndicator();

        let chatbotType = document.getElementById('bot-type').value;

        let url = "";

        switch (chatbotType) {
            case "code":
                url = "/api/v1/checkcodesession"
                break;
            case "doc":
                url = "/api/v1/checkdocsessione"
                break
        }
        while (true) {
            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) {
                break;
            }

            const data = await response.json();
            console.log(data)
            if (data.status == "OK") {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 8000));
        }
        displayChatbotMessage("Vamos?");
    } catch (error) {
        console.error('Error:', error);
    }
}

function waitContentLoad(callback) {
    mermaid.initialize({ startOnLoad: true });
    const targetDiv = document.getElementById("main-content");
    const observer = new MutationObserver((mutations) => {
        if (targetDiv.innerHTML !== "") { // Check if div has content
            observer.disconnect(); // Stop observing
            callback(); // Execute your callback function
        }
    });

    observer.observe(targetDiv, {
        childList: true,
        subtree: true
    }); // Observe for child list changes and subtree changes
}

/* Test Data Sample */
async function changeTestData() {
    /* Getting Selected Value */
    var model = document.getElementById('inputModelId').value;
    var textarea = document.getElementById('inputDocumentId');

    let url = "";

    if (model == "csv") {
        url = "/static/csv_br.txt";
    } else {
        url = "/static/json_br.txt";
    }

    const response = await fetch(url, { method: 'GET', });

    if (!response.ok) {
        console.log(response.status);
        throw new Error('Network response was not ok');
    }

    const data = await response.text();
    textarea.value = data;
    textarea.innerText = data;

}

function showPopup() {
    // Get the content from the div with id "ratingPageContent"
    const content = document.getElementById('ratingPageContent').value;

    // Check if the content exists
    if (!content) {
        console.error("Error: Element with id 'ratingPageContent' not found.");
        return;
    }

    // Create the popup window
    const popup = window.open('', '', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes');


    // Check if the popup was successfully opened.  Some browsers might block popups.
    if (popup == null || typeof popup.document === 'undefined') {
        console.error("Error: Popup window could not be opened. Check your browser's popup blocker settings.");
        return;
    }

    // Write the content to the popup's document
    popup.document.write(`<!DOCTYPE html>
  <html>
  <head>
    <title>Popup</title>
    <style>
        body { font-family: sans-serif; }
        pre { white-space: pre-wrap; /* Allows line breaks */ }
    </style>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`);

    popup.document.close();
}

async function performDownload() {
    // Get the content from the div with id "ratingPageContent"
    const content = document.getElementById('ratingPageContent').value;
    const b64source = btoa(content);

    const mimeType = document.getElementById('ratingMimeType').value;
    const transactionId = document.getElementById('ratingTransactionId').value;

    let data = {
        inputDoc: b64source,
        mimeType: mimeType,
        transactionId: transactionId
    }

    try {
        const response = await fetch('/api/v1/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.text();
        const popup = window.open('', '_blank', 'width=800,height=600');
        if (popup) {
            popup.document.write(responseData);
            popup.document.close();
        } else {
            alert("Could not open popup window. Please check your browser settings.");
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors here (e.g., display an error message to the user)
        return null; // or some default value or error representation
    }
}