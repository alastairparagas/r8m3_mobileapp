(function (window) {
    'use strict';
    var angular = window.angular;
    
    
    
    angular.module('rateMeApp.services').service('GalleryService', ['AuthService', '$cordovaNetwork', '$cordovaToast', '$http', '$q', function (AuthService, $cordovaNetwork, $cordovaToast, $http, $q) {

        var pictures = (localStorage.pictures && JSON.parse(localStorage.pictures)) || {},
            pictureCounter = Object.keys(pictures).length;

        // Gets random pictures from server for user to view and rate and adds them
        // to our pictures associative array.
        // First parameter: orderBy: created_at, raters_count, rating
        // Second parameter: limit: how many images to gather per pull
        this.getNewPictures = function (orderBy, limit) {
            var defer = $q.defer(),
                postOptions = {
                    orderBy: orderBy || 'created_at',
                    limit: limit || 30
                };

            if ($cordovaNetwork.isOffline()) {
                $cordovaToast.show("No internet connection. Cannot retrive images.", "long", "bottom");
                defer.reject({message: "No internet connection. Cannot retrieve images."});
                return defer.promise;
            }

            $http.post("http://myrighttoplay.com/R8M3/public/api/v1/image/view", postOptions).success(function (data) {
                var i, iLen, iImage, o, oLen;
                
                if (pictureCounter > 150) {
                    pictures = {};
                    pictureCounter = 0;
                }
                // Get every individual image from the set of images relayed by the server
                for (i = 0, iLen = data.info.length; i < iLen; i += 1) {
                    iImage = data.info[i];
                    // First image in set of pictures cannot be 
                    if (i === 0) {
                        if (pictures.hasOwnProperty(iImage.id)) {
                            break;
                        }
                    }
                    // If current user is in the ratees list of image, they rated this image already. Do appropriate manipulation of object so we can notify view/controller
                    if (AuthService.userid) {
                        for (o = 0, oLen = iImage.ratees.length; o < oLen; o += 1) {
                            if (AuthService.userid === iImage.ratees[o].user_id) {
                                iImage.hasRated = true;
                            }
                        }
                    }
                    pictures[iImage.id] = iImage;
                    delete iImage.ratees;
                    pictureCounter += 1;
                }
                localStorage.pictures = JSON.stringify(pictures);
                defer.resolve(pictures);
            }).error(function (data) {
                defer.reject({message: "Cannot retrieve images. " + data.message});
            });

            return defer.promise;
        };


        // Gets all of the pictures
        this.getPictures = function () {
            return pictures;
        };


        // Returns length of Pictures 'Array'
        this.countPictures = function () {
            return pictureCounter;
        };


        // Gets a picture's information given an imageId.
        // Returns an object holding information about the image.
        this.getPicture = function (imageId) {
            return pictures[imageId] || null;
        };

        // Gets a picture's information based on its index in 
        // picture's associative array (object).
        this.getPictureAtIndex = function (index) {
            var iterator = 0, i;
            for (i in pictures) {
                if (pictures.hasOwnProperty(i)) {
                    if (iterator === index) {
                        return pictures[i];
                    }
                    iterator += 1;
                }
            }
            return null;
        };


        this.ratePicture = function (imageId, score) {

        };

    }]);
    
    
    
}(window));