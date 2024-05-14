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

/* Send rating data */
function sendRatingData() {
    disableRating();
    document.getElementById("about").style.display = "none";
    document.getElementById("loading").style.display = "block";
    document.getElementById('ratingform').submit();
}

/* disable form */
function disableRating() {
    document.getElementById("processar").disabled = true;
}

/* show rating */
function showRating() {
    rating = document.getElementById('rating').value;
    document.getElementById('ratevalue').innerHTML = rating.toString();
}
