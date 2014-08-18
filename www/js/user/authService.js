/**
*   @ngdoc service
*   @name AuthService
*   @description Angular service that handles authorization, registration, states, and getting any sort of local information about the current user.
*/
(function (window) {
    "use strict";
    var angular = window.angular;

    
    
    angular.module('rateMe.user').service('AuthService', ['Base64Service', '$q', '$http', '$cordovaNetwork', '$cordovaToast', function (Base64, $q, $http, $cordovaNetwork, $cordovaToast) {
        
        /**
            @memberof AuthService
            @var {Object} user
            @description User object with id, encodedCredentials, username, password, and settings properties
            @private
        */
        var user = {
                id: 0,
                encodedCredentials: null,
                username: null,
                password: null,
                settings: {
                    
                }
            },
        /**
            @memberof AuthService
            @var {Boolean} isLoggedIn
            @description Determines whether the application is in a logged in state or not.
            @private
        */
            isLoggedIn,
        /**
            @memberof AuthService
            @var {Object} settingsDefaults
            @description Default settings for the app (e.g. smartUpload) that can later be overridden by the user.
            @private
        */
            settingsDefaults = {
                smartUpload: true
            };

        
        /**
            @memberof AuthService
            @description Manually sets provided user for this session, treats them as logged in, creates authorization header for our Angular requests to the server, and sets default settings if they already did not have one. Does not check against the server for valid credentials.
            @argument {String} username Username of the user to log in.
            @argument {String} password Password of the user to log in.
            @argument {Integer} userid Id of the user to log in.
            @argument {Object} settings Device/configuration settings of the user
            @private
        */
        function setUser(username, password, userid, settings) {
            var settingsKey;
            
            user = {
                id: userid,
                encodedCredentials: Base64.encode(username + ":" + password),
                username: username,
                password: password,
                settings: settings || {}
            };
            isLoggedIn = true;
            
            $http.defaults.headers.common.Authorization = 'Basic ' + user.encodedCredentials;
            
            angular.forEach(settingsDefaults, function (value, key) {
                if (!user.settings.hasOwnProperty(key) || user.settings[key] === undefined || user.settings[key] === null) {
                    user.settings[key] = settingsDefaults[key];
                }
            });
        }
        
        
        /**
            @memberof AuthService
            @description Resets the userObject that represents the currently logged in user
            @private
        */
        function resetUser() {
            user = {
                id: 0,
                encodedCredentials: null,
                username: null,
                password: null,
                settings: {
                    
                }
            };
            isLoggedIn = false;
        }
        
        
        /**
            @memberof AuthService
            @description Gets the user information stored in this session. Abstracts away properties that should be kept secret.
            @returns {Object} An object that represents the current user.
        */
        this.getUser = function () {
            var userObject = angular.copy(user);
            delete userObject.password;
            return userObject;
        };
        
        
        /**
            @memberof AuthService
            @description Returns the constructed authHeaders for the current user
            @returns {Object} Object representing Authorization headers, with an 'Authorization' index and the respective Auth Header value.
        */
        this.authHeaders = function () {
            var AuthHeaderObject = {};
            if (user.encodedCredentials !== null) {
                AuthHeaderObject = {'Authorization': 'Basic ' + user.encodedCredentials};
                return AuthHeaderObject;
            }
            
            return AuthHeaderObject;
        };
        
        
        /**
            @memberof AuthService
            @description Permanently stores current user as "currentUser" into localStorage. Unless they manually log out, they will be automatically logged in to the app because we are persisting their information.
            @argument {Object} userObject Object that holds the current user's information. 
            @see user property of AuthService to see what properties this object has to have.
            @private
        */
        function saveAsCurrentUser() {
            if (user && user.id > 0 && typeof user.username === "string") {
                localStorage.currentUser = JSON.stringify(user);
            }
        }
        
        
        /**
            @memberof AuthService
            @description Gets the localStorage-stored user that was stored as a currentUser.
            @returns {Object|null} Gets the user object stored as currentUser in localStorage.
            @private
        */
        function getCurrentUser() {
            if (localStorage.currentUser) {
                var currentUser = JSON.parse(localStorage.currentUser);
                if (currentUser && Object.keys(currentUser).length > 0) {
                    return currentUser;
                }
            }
            
            return null;
        }

        
        /**
            @memberof AuthService
            @description Sets the device settings for our user
            @argument {String} key The key name of the setting whose value is changing.
            @argument {String} value the value to be changed for a specific setting defined by a key
        */
        this.setSetting = function (key, value) {
            user.settings[key] = value;
            localStorage.currentUser = JSON.stringify(user);
        };

        
        /**
            @memberof AuthService
            @description Gets the device settings from our user
            @argument {String} key The key name of the setting whose values are being retrieved.
            @returns {String|null} The value of the provided setting key on success, null if value cannot be found.
        */
        this.getSetting = function (key) {
            return user.settings[key] || settingsDefaults[key] || null;
        };
        
        
        /**
            @memberof AuthService
            @description Informs whether the application is in a "logged-in" state or not.
            @returns {Boolean} True if app is in a "logged in" state, False if not.
        */
        this.isLoggedIn = function () {
            return isLoggedIn;
        };

        
        /**
            @memberof AuthService
            @description Logs the user in. This is checked against the user to see if the user exists and if the password provided matches the one stored under the user's account on the server.
            @argument {String} username Username of the user to log in
            @argument {String} password Password of the user to log in
            @returns {HttpPromise} Promise resolved on successful log in, rejected on failure.
        */
        this.login = function (username, password) {
            var defer = $q.defer(),
                storedCurrentUser = getCurrentUser();

            if (isLoggedIn === true) {
                defer.resolve({message: "Already logged in. Please log out to log in as another user."});
                return defer.promise;
            }
            
            if (storedCurrentUser !== null) {
                
                setUser(storedCurrentUser.username, storedCurrentUser.password, storedCurrentUser.id, storedCurrentUser.settings);
                defer.resolve({message: "Automatically logging in."});
                
            } else if (typeof username === "string" && typeof password === "string") {
                
                if ($cordovaNetwork.isOffline()) {
                    $cordovaToast.show("No internet connection.", "long", "bottom");
                    defer.reject({message: "No internet connection. Cannot check credentials."});
                    return defer.promise;
                }
                
                $http.post("http://myrighttoplay.com/R8M3/public/api/v1/user/login", {'username': username, 'password': password})
                    .success(function (response) {
                        setUser(username, password, response.info.id);
                        saveAsCurrentUser();
                        defer.resolve(response);
                    }).error(function (response) {
                        defer.reject(response);
                    });
                
            } else {
                    
                defer.reject({mesage: "Username and/or password not provided."});
                
            }

            return defer.promise;
        };

         
        /**
            @memberof AuthService
            @description Resets the user object and removes our application's isLoggedIn state, deletes Authorization headers, and removes currentUser from localStorage.
        */
        this.logout = function () {
            delete $http.defaults.headers.common.Authorization;
            resetUser();
            localStorage.removeItem("currentUser");
        };
        
        
        /**
            @memberof AuthService
            @description Registers the user into our application.
            @returns {HttpPromise} Promise resolved on success, rejected on failure.
        */
        this.register = function (infoData) {
            
            var defer = $q.defer();

            if ($cordovaNetwork.isOffline()) {
                $cordovaToast.show("No internet connection.", "long", "bottom");
                defer.reject({message: "No internet connection. Cannot add in server."});
                return defer.promise;
            }

            $http.post("http://myrighttoplay.com/R8M3/public/api/v1/user/add", infoData)
                .success(function (data) {
                    setUser(infoData.username, infoData.password, data.info.id);
                    saveAsCurrentUser();
                    defer.resolve(data);
                })
                .error(function (data) {
                    defer.reject(data);
                });

            return defer.promise;
        };

        
    }]);
    
    
    
}(window));