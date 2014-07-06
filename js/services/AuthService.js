// Service versus Factory
// makes a good explanation = http://stackoverflow.com/questions/14324451/angular-service-vs-angular-factory
// Services pass "this" automatically, factory has to manually pass
// an object.

angular.module('rateMeApp.services').service('AuthService', function(Base64, $q, $http, $cordovaNetwork, $cordovaToast){
    // Use an object to prevent too much global variables - very bad.
    // See Douglas Crockford's "Javascript: The Good Parts"
    this.isLoggedIn = false;
    
    // Helper methods for our Authentication service
    // Set the Authentication properties
    this.setUser = function(username, password){
        this.encodedCredentials = Base64.encode(username + ":" + password);
        // Set Angular Authorization headers for Stateless HTTP Basic
        $http.defaults.headers.common['Authorization'] = 'Basic ' + this.encodedCredentials;
        this.username = username;
        this.password = password;
        this.isLoggedIn = true;
    }
    
    // Create "permanent" storage of user information
    this.permStorage = function(username, password){
        localStorage.username = username;
        localStorage.password = password;
        localStorage.encodedCredentials = Base64.encode(username + ":" + password);
    }
    
    // Attempts to log the user in with stateless HTTP Basic Auth that we set server-side with Laravel
    this.login = function(username, password){
        // Javascript is asynchronous for UI responsiveness, therefore, let's use a promise instead of usual true/false
        // If we use the usual true/false, this function will resolve to undefined because it takes time to pull server
        // data, at which point Javascript already executes the rest of the code, interpreting the function as it was before.
        var defer = $q.defer();
        var messageBag = {};
        var aUsername, aPassword;
        // We need to set a variable that sets the correct context of "this" to this function
        // because when we use internal callback functions within this function, "this" gets
        // set to that function's scope and not this parent/outside function's scope
        var that = this;
        
        // If already logged in, resolve the promise!
        if(this.isLoggedIn === true && this.username != "undefined" && this.password != "undefined"){
            return true;
        }
        
        // Variable to hold the decision. If no username/password was provided, that is a command to check localStorage instead
        // of passed inputs. Two possible values: storage (to check localStorage) and input (to check passed parameters/inputs).
        // In this case, we shall use == instead of === because we need valid passwords, not undefined and null.
        var inputOrStorage;
        if(typeof username == "undefined" && typeof password == "undefined"){
            inputOrStorage = "storage";
            aUsername = localStorage.username;
            aPassword = localStorage.password;
        }else{
            inputOrStorage = "input";
            aUsername = username;
            aPassword = password;
        }
        
        // If username|password variables are still undefined at this point, then do not authenticate
        if(typeof aUsername == "undefined" || typeof aPassword == "undefined"){
            return false;
        }
        
        // If storage, only set the Object properties using the localStorage stored information, else
        // "input" option - use passed parameters
        if(inputOrStorage === "storage"){
            that.setUser(aUsername, aPassword);
            messageBag.message = "Automatically logging in.";
            alert('still running ' + aUsername);
            defer.resolve(messageBag);
        }else{
            $http.post("http://myrighttoplay.com/R8M3/public/api/v1/user/login", {'username': aUsername, 'password': aPassword})
            .success(function(data){
                that.setUser(aUsername, aPassword);
                that.permStorage(aUsername, aPassword);
                defer.resolve(data);
            }).error(function(data){
                defer.reject(data);
            });
        }

        return defer.promise;
    };
    
    // Logs the user out and resets Authorization headers
    this.logout = function(){
        // Delete Basic Authorization set header
        delete $http.defaults.headers.common.Authorization;
        // Delete the username/password properties, set isLoggedIn to false
        delete this.username;
        delete this.password;
        this.isLoggedIn = false;
        // Clear all localStorage data
        localStorage.clear();
    };
    
    // Registers the user and logs them in automatically given an
    // object. The object must have a username, password, and email
    // field.
    this.register = function(infoData){
        // Asynchronous preparation
        var defer = $q.defer();
        var that = this;
        
        $http.post("http://myrighttoplay.com/R8M3/public/api/v1/user/register", infoData)
        .success( function(data){
            // Log them in
            that.setUser(infoData.username, infoData.password);
            that.permStorage(infoData.username, infoData.password);
            defer.resolve(data);
        })
        .error( function(data){
            defer.reject(data);
        });
        
        // Return a promise because Javascript is asynchronous for UI responsiveness
        return defer.promise;
    };
            
});