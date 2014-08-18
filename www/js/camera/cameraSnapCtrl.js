(function (window) {
    'use strict';
    var angular = window.angular;

    
    
    angular.module('rateMe.camera').controller('CameraSnapCtrl', ['$scope', '$state', '$cordovaToast', 'CameraService', 'ErrorService', function ($scope, $state, $cordovaToast, CameraService, ErrorService) {
        
        ErrorService.resetError('CameraService');
            
        CameraService.snapPicture("imageSnapStage")
            .then(
                function (data) {
                    $scope.loading();
                    $scope.picture = data.image;
                    $scope.$watch(
                        function () {
                            return window.document.getElementById("imageSnapStage").complete;
                        },
                        function (booleanCompleteness) {
                            if (booleanCompleteness === true) {
                                CameraService.compressPicture("imageSnapStage");
                                $scope.loadingEnd();
                                $state.go('app.camera-upload');
                            }
                        }
                    );
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