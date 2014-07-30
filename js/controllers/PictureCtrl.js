var module = angular.module('rateMeApp.controllers');

module.controller('PictureCtrl', function(PictureService, $scope, $location, $cordovaToast){
    
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
        
        // Reset interface
        delete $scope.picture.data;
        $scope.picture.failed = false;
        $scope.picture.progress = 0;
        
        // Upload with Qs
        PictureService.uploadPicture(fileUrl)
        .then(
            function (data){
                $scope.picture.progress = 100;
                $scope.picture.data = data;
            },
            function (data){
                $scope.picture.failed = true;
                $scope.picture.progress = 100;
                $scope.picture.data = data;
            },
            function (data){
                if(data < 35){
                    $scope.picture.progress = 35;
                    return;
                }
                if(data > $scope.picture.progress){
                    $scope.picture.progress = data;
                }
            }
        );
        
    };
    
    
});