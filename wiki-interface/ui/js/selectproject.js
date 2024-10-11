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

window.addEventListener('DOMContentLoaded', event => {
    document.body.classList.toggle('sb-sidenav-toggled');
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

    
});
