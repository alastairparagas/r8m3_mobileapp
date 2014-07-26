var module = angular.module('rateMeApp.controllers');

module.controller('PictureCtrl', function(PictureService, $scope, $location, $cordovaDialogs, $cordovaToast){
    
    $scope.picture = {};
    
    
    // Opens the built-in camera application and grabs the taken image
    $scope.picture.takePicture = function() {

        delete $scope.picture.file;
        delete $scope.picture.data;
        
        // Pre-flight checks
        PictureService.takePicture()
        .then(
            function (data){
                $scope.picture.file = data;  
            },
            function (data){
                if(typeof data.message != "undefined"){
                    $scope.picture.data = data;
                }
            }
        );
        
    };
    
    
    // Uploads the picture to our servers
    $scope.picture.uploadPicture = function(fileUrl){
        
        delete $scope.picture.data;
        $scope.picture.failed = false;
        
        // Pre-flight checks
        $scope.isOnlineNotify();
        if( typeof fileUrl == "undefined" ){
            $location.path('/app/home');
        }
        
        // Upload with Qs
        PictureService.uploadPicture(fileUrl)
        .then(
            function (data){
                $scope.picture.progress = 100;
                $scope.picture.data = data;
            },
            function (data){
                $scope.picture.status = true;
                $scope.picture.progress = 100;
                $scope.picture.data = data;
            },
            function (data){
                $scope.picture.progress = data;
            }
        );
        
    };
    
    
});