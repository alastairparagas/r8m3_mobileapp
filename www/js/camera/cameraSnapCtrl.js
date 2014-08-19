(function (window) {
    'use strict';
    var angular = window.angular;

    
    
    angular.module('rateMe.camera').controller('CameraSnapCtrl', ['$scope', '$state', '$cordovaToast', 'CameraService', 'ErrorService', function ($scope, $state, $cordovaToast, CameraService, ErrorService) {
        
        ErrorService.resetError('CameraService');
            
        CameraService.snapPicture("imageSnapStage")
            .then(
                function (data) {
                    $scope.picture = data.image;
                    $state.go('app.camera-upload');
                },
                function (data) {
                    if (typeof data.message !== "undefined") {
                        $cordovaToast.show(data.message, "long", "bottom");
                    }
                    $state.go('app.home');
                }
            );
        
    }]);
    
    
    
}(window));