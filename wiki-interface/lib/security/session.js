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

module.exports = function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        if(typeof req.session.redirectTo !== 'undefined' && req.session.redirectTo) {
            res.redirect('/gitlab');    
        } else {
            req.session.redirectTo = req.url;
            res.redirect('/gitlab');
        }
    }
}

module.exports = function isProjectSet(req, res, next) {
    if (req.user) {
        if (isNaN(req.session.projectId)) {
            if(!req.url.includes("selectproject") && !req.url.includes("setproject") && !req.headers["referer"].includes("selectproject")) {
                console.log("entrei no if");
                res.redirect("/ui/selectproject");
            } else {
                next();
            }
        } else {
            next();
        }

    } else {
        if(typeof req.session.redirectTo !== 'undefined' && req.session.redirectTo) {
            res.redirect('/gitlab');    
        } else {
            req.session.redirectTo = req.url;
            res.redirect('/gitlab');
        }
    }
}

