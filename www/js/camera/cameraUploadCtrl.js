(function (window) {
    'use strict';
    var angular = window.angular;

    
    
    angular.module('rateMe.camera').controller('CameraUploadCtrl', ['$cordovaToast', '$scope', '$state', 'CameraService', 'ErrorService', function ($cordovaToast, $scope, $state, CameraService, ErrorService) {
        
        $scope.picture = CameraService.getPicture("imageUploadStage");
        $scope.uploadProgress = 0;
        // True - hide button, False - show button
        $scope.buttonsState = {
            undo: false,
            home: false,
            upload: false
        };
        $scope.uploadFailed = false;
        $scope.uploadResponse = {};
        
        if ($scope.picture === null || $scope.picture === undefined) {
            $state.go('app.home');
        }
        
        
        
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
                        $scope.buttonsState.upload = true;
                        $scope.buttonsState.home = false;
                        $scope.buttonsState.undo = true;
                    },
                    function (data) {
                        $scope.uploadFailed = true;
                        $scope.uploadProgress = 100;
                        $scope.uploadResponse = data;
                        $scope.buttonsState.upload = false;
                        $scope.buttonsState.home = false;
                        $scope.buttonsState.undo = false;
                    },
                    function (data) {
                        $scope.uploadProgress = Math.floor(data.loaded / data.total * 100);
                        $scope.buttonsState.upload = true;
                        $scope.buttonsState.home = true;
                        $scope.buttonsState.undo = true;
                        $scope.$apply();
                    }
                );

        };
        
    }]);
    
    
    
}(window));