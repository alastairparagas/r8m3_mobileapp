(function (window) {
    'use strict';
    var angular = window.angular,
        module = angular.module('rateMeApp.controllers');

    
    
    module.controller('GalleryCtrl', ['GalleryService', '$scope', '$state', '$q', function (GalleryService, $scope, $state, $q) {

        // Do initial pull of images currently in our possession on Gallery Load
        $scope.pictures = GalleryService.getPictures() || {};
        $scope.message = "";

        // Object is still empty at this point, fresh load from server.
        if (Object.getOwnPropertyNames($scope.pictures).length === 0) {
            GalleryService.getNewPictures().then(
                function (data) {
                    $scope.message = data;
                },
                function (data) {
                    $scope.message = "Error: " + data;
                }
            );
        }

    }]);
    
    
    
}(window));