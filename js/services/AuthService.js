(function (window) {
    "use strict";
    var angular = window.angular;

    
    
    angular.module('rateMeApp.services').service('AuthService', ['Base64', '$q', '$http', '$cordovaNetwork', '$cordovaToast', function (Base64, $q, $http, $cordovaNetwork, $cordovaToast) {

        // Use an object to prevent too much global variables - very bad.
        // See Douglas Crockford's "Javascript: The Good Parts"
        this.isLoggedIn = false;
        this.userid = 0;
        this.username = null;
        this.password = null;
        var settings = {},
            settingsDefaults = {
                smartUpload: true
            };

        // Helper methods for our Authentication service
        // Set the Authentication properties
        this.setUser = function (username, password, userid) {
            var settingsKey;
            
            this.encodedCredentials = Base64.encode(username + ":" + password);
            // Set Angular Authorization headers for Stateless HTTP Basic
            $http.defaults.headers.common.Authorization = 'Basic ' + this.encodedCredentials;
            this.userid = userid;
            this.username = username;
            this.password = password;
            this.isLoggedIn = true;
            settings = (localStorage.settings && JSON.parse(localStorage.settings)) || {};
            for (settingsKey in settingsDefaults) {
                if (settingsDefaults.hasOwnProperty(settingsKey)) {
                    settings[settingsKey] = settings[settingsKey] || settingsDefaults[settingsKey];
                }
            }
        };

        // Create "permanent" storage of user information
        this.permStorage = function (username, password, userid) {
            localStorage.userid = userid;
            localStorage.username = username;
            localStorage.password = password;
            localStorage.encodedCredentials = Base64.encode(username + ":" + password);
        };

        // Set user settings
        this.setSetting = function (key, value) {
            settings[key] = value;
            localStorage.settings = JSON.stringify(settings);
        };

        // Get user settings. It doesn't exist? Return null
        this.getSetting = function (key) {
            return settings[key] || null;
        };

        // Attempts to log the user in with stateless HTTP Basic Auth that we set server-side with Laravel
        this.login = function (username, password) {
            // Javascript is asynchronous for UI responsiveness, therefore, let's use a promise instead of usual true/false
            // If we use the usual true/false, this function will resolve to undefined because it takes time to pull server
            // data, at which point Javascript already executes the rest of the code, interpreting the function as it was before.
            // We need to set a variable that sets the correct context of "this" to this function
            // because when we use internal callback functions within this function, "this" gets
            // set to that function's scope and not this parent/outside function's scope
            var defer = $q.defer(),
                messageBag = {},
                aUsername,
                aPassword,
                aUserid,
                that = this,
                inputOrStorage;

            // If already logged in, resolve the promise!
            if (this.isLoggedIn === true) {
                defer.resolve({message: "Already logged in!"});
                return defer.promise;
            }

            // Variable to hold the decision. If no username/password was provided, that is a command to check localStorage instead
            // of passed inputs. Two possible values: storage (to check localStorage) and input (to check passed parameters/inputs).
            // In this case, we shall use == instead of === because we are targeting for both undefined and nulls.
            
            if (typeof username === "undefined" && typeof password === "undefined") {
                inputOrStorage = "storage";
                aUsername = localStorage.username;
                aPassword = localStorage.password;
                aUserid = localStorage.userid;
            } else {
                inputOrStorage = "input";
                aUsername = username;
                aPassword = password;
            }

            // If username|password variables are still undefined at this point, then do not authenticate
            if (typeof aUsername === "undefined" || typeof aPassword === "undefined") {
                defer.reject({mesage: "Username and/or password not provided."});
                return defer.promise;
            }

            // If storage, only set the Object properties using the localStorage stored information, else
            // "input" option - use passed parameters
            if (inputOrStorage === "storage") {
                this.setUser(aUsername, aPassword, aUserid);
                messageBag.message = "Automatically logging in.";
                defer.resolve(messageBag);
            } else {
                if ($cordovaNetwork.isOffline()) {
                    $cordovaToast.show("No internet connection.", "long", "bottom");
                    defer.reject({message: "No internet connection. Cannot check credentials."});
                    return defer.promise;
                }

                $http.post("http://myrighttoplay.com/R8M3/public/api/v1/user/login", {'username': aUsername, 'password': aPassword})
                    .success(function (response) {
                        that.setUser(aUsername, aPassword, response.info.id);
                        that.permStorage(aUsername, aPassword, response.info.id);
                        defer.resolve(response);
                    }).error(function (response) {
                        defer.reject(response);
                    });
            }

            return defer.promise;
        };

        // Provides the Authentication headers conveniently packaged as an object
        this.returnAuthHeaders = function () {
            var AuthHeaderObject;
            if (typeof this.encodedCredentials !== "undefined") {
                AuthHeaderObject = {'Authorization': 'Basic ' + this.encodedCredentials};
            }
            return AuthHeaderObject;
        };

        // Logs the user out and resets Authorization headers
        this.logout = function () {
            // Delete Basic Authorization set header
            delete $http.defaults.headers.common.Authorization;
            // Delete the username/password properties, set isLoggedIn to false
            delete this.userid;
            delete this.username;
            delete this.password;
            delete this.encodedCredentials;
            this.isLoggedIn = false;
            // Clear all localStorage data
            localStorage.clear();
        };

        // Registers the user and logs them in automatically given an
        // object. The object must have a username, password, and email
        // field.
        this.register = function (infoData) {
            // Asynchronous preparation
            var defer = $q.defer(),
                that = this;

            if ($cordovaNetwork.isOffline()) {
                $cordovaToast.show("No internet connection.", "long", "bottom");
                defer.reject({message: "No internet connection. Cannot add in server."});
                return defer.promise;
            }

            $http.post("http://myrighttoplay.com/R8M3/public/api/v1/user/add", infoData)
                .success(function (data) {
                    // Log them in
                    that.setUser(infoData.username, infoData.password, data.info.id);
                    that.permStorage(infoData.username, infoData.password, data.info.id);
                    defer.resolve(data);
                })
                .error(function (data) {
                    defer.reject(data);
                });

            // Return a promise because Javascript is asynchronous for UI responsiveness
            return defer.promise;
        };

    }]);
    
    
    
}(window));