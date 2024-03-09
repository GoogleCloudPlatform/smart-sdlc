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
function sendUsData() {

    disableAll();
    document.getElementById("usinputdata").style.display = "none";
    document.getElementById("loading").style.display = "block";

    window.location.href = "/process/" + document.getElementById('usalgo').value + "/" + document.getElementById('project').value + "/" + document.getElementById('usinputdoc').value;

}

/* Test Case Call */
function sendTcData() {

    disableAll();
    document.getElementById("tcinputdata").style.display = "none";
    document.getElementById("loading").style.display = "block";

    window.location.href = "/process/" + document.getElementById('tcalgo').value + "/" + document.getElementById('project').value + "/" + document.getElementById('tcinputdoc').value;

}

/* Test Script Call */
function sendTsData() {

    disableAll();
    document.getElementById("tsinputdata").style.display = "none";
    document.getElementById("loading").style.display = "block";

    window.location.href = "/process/" + document.getElementById('tsalgo').value + "/" + document.getElementById('project').value + "/" + document.getElementById('tsinputdoc').value;

}

/* disable form */
function disableAll() {
    document.getElementById("btnabout").disabled = true;
    document.getElementById("btnus").disabled = true;
    document.getElementById("btntc").disabled = true;
    document.getElementById("btnts").disabled = true;
}