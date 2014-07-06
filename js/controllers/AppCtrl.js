var module = angular.module('rateMeApp.controllers');

module.controller('AppCtrl', function(AuthService, $scope, $ionicModal, $timeout, $cordovaNetwork, $cordovaCamera, $cordovaDialogs, $cordovaToast, $http) {

    $scope.register = {};
    $scope.login = {};
    
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
    
    $scope.isLoggedIn = function(){
        return AuthService.isLoggedIn;
    };
    
    $scope.checkInternet = function(){
        if($cordovaNetwork.isOffline()){
            $cordovaToast.show("You currently have no internet connection.", "long", "bottom");
        }
        return $cordovaNetwork.isOnline();
    };
    
    $scope.login.submit = function() {
        AuthService.login($scope.login.data.username, $scope.login.data.password)
        .then(
            function (data){
                $scope.login.modal.hide();
            },
            function (data){
                $scope.login.message = data.message;
            }
        );
        
    };
    
    $scope.register.submit = function() {
         AuthService.register($scope.register.data)
         .then(
             function (data){
                $scope.register.modal.hide();      
             },
             function (data){
                 $scope.register.message = data.message;
             }
         );
    };
    
    
    $scope.takePicture = function() {
        // Cordova Camera Options https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
        var options = { 
            quality : 100, 
            destinationType : Camera.DestinationType.FILE_URI, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.PNG,
            targetWidth: 1300,
            targetHeight: 1300,
            saveToPhotoAlbum: false
        };
        // Take a picture, redirect to page with passed image location
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $cordovaDialogs.alert(imageData);
        }, function(err) {
            $cordovaToast.show("Picture not taken", "long", "bottom");
        });
    };
    
    
});



