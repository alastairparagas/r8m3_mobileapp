var module = angular.module('rateMeApp.controllers');

module.controller('AppCtrl', function(AuthService, $ionicModal, $ionicSideMenuDelegate, $ionicPopup, $scope, $state, $cordovaNetwork, $cordovaToast) {

    $scope.register = {};
    $scope.login = {};
    $scope.user = {};
    
    
    // Login and Register Modals
    $ionicModal.fromTemplateUrl('templates/user/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.login.modal = modal;
    });
    $ionicModal.fromTemplateUrl('templates/user/register.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.register.modal = modal;
    });
    
    
    // Checks if user is logged in.
    $scope.isLoggedIn = function(){
        $scope.user.username = AuthService.username;
        return AuthService.isLoggedIn;
    }
    
    // Checks if device is online.
    $scope.isOnline = function(){
        return $cordovaNetwork.isOnline();
    };
    
    
    // Tries to log the person in
    $scope.login.submit = function() {
        
        delete $scope.login.message;
        
        AuthService.login($scope.login.data.username, $scope.login.data.password)
        .then(
            function (data){
                $scope.login.modal.hide();
                delete $scope.login.data;
                $state.go('app.gallery');
            },
            function (data){
                $scope.login.message = data.message;
            }
        );
    };
    
    // Logs the user out and redirects back to home page
    $scope.login.logout = function(){
        AuthService.logout();
        $state.go('app.home');
    };
    
    
    // Registers the user and automatically logs them in
    $scope.register.submit = function() {
        
        delete $scope.register.message;
        
         AuthService.register($scope.register.data)
         .then(
             function (data){
                $scope.register.modal.hide();
                delete $scope.register.data;
             },
             function (data){
                 $scope.register.message = data.message;
             }
         );
    };
    
    
    $scope.about = function() {
        $ionicPopup.alert({
            title: 'About R8M3',
            templateUrl: "templates/about.html",
            scope: $scope
        });
    };
    
    
    $scope.externalLink = function(url) {
        if(url != "undefined"){
            window.open(encodeURI(url), "_system"); 
        }
        return false;
    };
    
});



