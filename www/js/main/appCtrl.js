(function (window) {
    'use strict';
    var angular = window.angular;

    
    
    angular.module('rateMe').controller('AppCtrl', ['$rootScope', '$scope', '$state', '$cordovaNetwork', '$ionicLoading', '$ionicModal', '$ionicPopup', 'AuthService', function ($rootScope, $scope, $state, $cordovaNetwork, $ionicLoading, $ionicModal, $ionicPopup, AuthService) {

        $scope.register = {};
        $scope.login = {};
        $scope.user = {};
        

        // Login and Register Modals
        $ionicModal.fromTemplateUrl('js/user/partials/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.login.modal = modal;
        });
        $ionicModal.fromTemplateUrl('js/user/partials/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.register.modal = modal;
        });


        // Checks if user is logged in.
        $scope.isLoggedIn = function () {
            $scope.user.username = AuthService.getUser().username;
            return AuthService.isLoggedIn();
        };
        
        
        $scope.loading = function () {
            $ionicLoading.show({
                templateUrl: 'js/main/partials/loading.html'
            });
        };
        
        
        $scope.loadingEnd = function () {
            $ionicLoading.hide();
        };
        
        
        // Tries to log the person in
        $scope.login.submit = function () {

            delete $scope.login.message;
            $scope.loading();

            AuthService.login($scope.login.data.username, $scope.login.data.password)
                .then(
                    function (data) {
                        $scope.login.modal.hide();
                        delete $scope.login.data;
                        $scope.loadingEnd();
                        $state.go('app.gallery-home');
                    },
                    function (data) {
                        $scope.login.message = data.message;
                        $scope.loadingEnd();
                    }
                );
        };

        // Logs the user out and redirects back to home page
        $scope.login.logout = function () {
            AuthService.logout();
            $state.go('app.home');
        };


        // Registers the user and automatically logs them in
        $scope.register.submit = function () {

            delete $scope.register.message;
            $scope.loading();

            AuthService.register($scope.register.data)
                .then(
                    function (data) {
                        $scope.register.modal.hide();
                        delete $scope.register.data;
                        $scope.loadingEnd();
                    },
                    function (data) {
                        $scope.register.message = data.message;
                        $scope.loadingEnd();
                    }
                );
        };


        $scope.about = function () {
            $ionicPopup.alert({
                title: 'About R8M3',
                templateUrl: "js/main/partials/about.html",
                scope: $scope
            });
        };


        $scope.externalLink = function (url) {
            if (url !== undefined) {
                window.open(encodeURI(url), "_system");
            }
            return false;
        };

    }]);



}(window));