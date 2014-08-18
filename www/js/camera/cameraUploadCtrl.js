(function (window) {
    'use strict';
    var angular = window.angular;

    
    
    angular.module('rateMe.camera').controller('CameraUploadCtrl', ['$cordovaToast', '$scope', '$state', 'CameraService', 'ErrorService', function ($cordovaToast, $scope, $state, CameraService, ErrorService) {
        
        $scope.picture = CameraService.getPicture("imageUploadStage");
        $scope.uploadProgress = 0;
        $scope.uploadFailed = false;
        $scope.uploadResponse = {};
        
        
        
        $scope.$watch(
            function () {
                return ErrorService.getError('CameraService');
            },
            function (error) {
                if (typeof error === "string") {
                    $cordovaToast.show(error, "long", "bottom");
                }
            }
        );
        
        $scope.uploadPicture = function () {
            
            CameraService.uploadPicture()
                .then(
                    function (data) {
                        $scope.uploadProgress = 100;
                        $scope.uploadResponse = data;
                    },
                    function (data) {
                        $scope.uploadFailed = true;
                        $scope.uploadProgress = 100;
                        $scope.uploadResponse = data;
                    },
                    function (data) {
                        if (data > $scope.uploadProgress) {
                            $scope.uploadProgress = data;
                        }
                    }
                );

        };
        
    }]);
    
    
    
}(window));