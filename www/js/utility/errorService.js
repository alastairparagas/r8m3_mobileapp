/**
    @ngdoc service
    @name ErrorService
    @description Angular Service that handles error reporting so that our controllers can catch the respective error and report them as they may please. This is in a way, a global error-catcher service.
*/
(function (window) {
    'use strict';
    var angular = window.angular;
    
    angular.module('rateMe.utility').service('ErrorService', [function () {
        
        
        /**
            @memberof ErrorService
            @var {Object} errorStack
            @description Object with indexes of the name of a respective service/controller, and value of an array of errors for that respective service.
            @private
        */
        var errorStack = {};
        
        
        /**
            @memberof ErrorService
            @description Returns the first set of messages for a respective service.
            @argument {String} Name of Service whose errors needs to be grabbed
            @returns {String|Null} The first error message from the array of string error-messages for a particular service, Null if no error message found.
        */
        this.getError = function (serviceName) {
            
            if (errorStack[serviceName] && errorStack[serviceName].length > 0) {
                return errorStack[serviceName].shift();
            }
            
            return null;
        };
        
        
        /**
            @memberof ErrorService
            @description Sets the error for the provided service.
            @argument {String} serviceName Name of Service whose error is being set.
            @argument {String} errorMessage Error Message being set for the provided service.
        */
        this.setError = function (serviceName, errorMessage) {
            
            if (!errorStack.hasOwnProperty(serviceName)) {
                errorStack[serviceName] = [];
            }
            
            errorStack[serviceName].push(errorMessage);
            
        };
        
        
        /**
            @memberof ErrorService
            @description Resets the error stack for a specific service.
            @argument {String} serviceName Name of service whose error stack is being reset/deleted.
        */
        this.resetError = function (serviceName) {
            if (errorStack[serviceName] && errorStack[serviceName].length > 0) {
                delete errorStack[serviceName];
            }
        };
        
        
        /**
            @memberof ErrorService
            @description Resets our whole stack of errors.
        */
        this.resetErrors = function () {
            errorStack = {};
        };
        
    }]);
    
}(window));