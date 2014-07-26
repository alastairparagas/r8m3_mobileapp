var module = angular.module('rateMeApp.controllers');

module.controller('AppCtrl', function(AuthService, $ionicModal, $ionicSideMenuDelegate, $ionicPopup, $scope, $location, $cordovaNetwork, $cordovaToast) {

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
    
    // Notifies whether the user is online or not.
    $scope.isOnlineNotify = function(){
        if($cordovaNetwork.isOffline()){
            $cordovaToast.show("You currently have no internet connection.", "long", "bottom");
        }
    }
    
    // Checks if device is online.
    $scope.isOnline = function(){
        return $cordovaNetwork.isOnline();
    };
    
    
    // Tries to log the person in
    $scope.login.submit = function() { 
        
        $scope.isOnlineNotify();
        delete $scope.login.message;
        
        AuthService.login($scope.login.data.username, $scope.login.data.password)
        .then(
            function (data){
                $scope.login.modal.hide();
                delete $scope.login.data;
                $location.path('/app/gallery');
            },
            function (data){
                $scope.login.message = data.message;
            }
        );
    };
    
    
    // Logs the user out and redirects back to home page
    $scope.login.logout = function(){
        AuthService.logout();
        $location.path('/app/home');
    };
    
    
    // Registers the user and automatically logs them in
    $scope.register.submit = function() {
        
        $scope.isOnlineNotify();
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
            template: 'R8M3 is an anonymous photo-sharing and rating application designed by Alastair Paragas and Anil Jason of Stela Inc. Copyright 2014. <br/><br/> If you have any suggestions or recommendations on how we can best improve the app, do not hesitate to contact us at us@r8m3.com. <br/><br/> Interested in Stela? We are a group of active programmers and designers bent on creating products that promote freedom and transparency.'
        });
    };
    
    
    $scope.disableSideMenu = function() {
        $ionicSideMenuDelegate.canDragContent(false);  
    };
    
});



