angular.module('rateMeApp.services').service('PictureService', function (AuthService, $q, $state, $cordovaNetwork, $cordovaToast, $cordovaFile, $cordovaCamera, $cordovaDialogs) {
    'use strict';
    
    // Provides the camera interface and takes picture
    this.takePicture = function () {
        
        // Cordova Camera Options https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
        var defer = $q.defer(),
            options = {
                destinationType : Camera.DestinationType.FILE_URI,
                correctOrientation: true,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : false,
                saveToPhotoAlbum: false,
                encodingType: 0
            };
        
        // Smart-Upload feature
        if (AuthService.getSetting("smartUpload")) {
            if (navigator.connection.type === Connection.ETHERNET || navigator.connection.type === Connection.Wifi) {
                options.quality = 100;
            } else {
                options.quality = 70;
            }
        } else {
            options.quality = 70;
        }
        
        // Take a picture, redirect to page with passed image location
        $cordovaCamera.getPicture(options).then(function (imageData) {
            $cordovaFile.readFileMetadataAbsolute(imageData).then(
                function (file) {
                    defer.resolve(imageData);
                },
                function (error) {
                    defer.reject({message: "Cannot get image's metadata: " + error});
                }
            );
        }, function (error) {
            defer.reject({message: "Picture not taken: " + error});
        });
        
        return defer.promise;
    };
    
    
    // Uploads a picture given the file path
    this.uploadPicture = function (filePath) {
        // Cordova File Transfer Options https://github.com/apache/cordova-plugin-file-transfer/blob/master/doc/index.md
        var defer = $q.defer(),
            uploadUrl,
            options = {
                fileKey: "image_file_actual",
                mimeType: "image/png"
            };
        
        // Pictures can only be taken after 10 minute increments
        if (localStorage.lastSnap && new Date().getTime() - localStorage.lastSnap < 600000) {
            $cordovaToast.show("Pictures can only be taken in 10 minute increments.", "long", "bottom");
            defer.reject({message: "Pictures can only be taken in 10 minute increments."});
            return defer.promise;
        }
        
        // No internet connection, stop upload
        if ($cordovaNetwork.isOffline()) {
            $cordovaToast.show("No internet connection. Cannot upload.", "long", "bottom");
            defer.reject({message: "No internet connection. Cannot upload"});
            return defer.promise;
        }
        
        // filePath isn't valid, stop upload
        if (typeof filePath === "undefined") {
            $cordovaToast.show("The file does not exist/invalid file path", "long", "bottom");
            $state.go('app.home');
            defer.reject({message: "File/Path doesn't exist"});
            return defer.promise;
        }
        
        if (AuthService.isLoggedIn === true) {
            uploadUrl = "http://myrighttoplay.com/R8M3/public/api/v1/image/add";
            options.headers = AuthService.returnAuthHeaders();
        } else {
            uploadUrl = "http://myrighttoplay.com/R8M3/public/api/v1/image/add-guest";
        }
        
        $cordovaFile.uploadFile(uploadUrl, filePath, options)
            .then(
                function (data) {
                    defer.resolve(JSON.parse(data.response));
                    localStorage.lastSnap = new Date().getTime();
                },
                function (data) {
                    defer.reject(data);
                },
                function (data) {
                    defer.notify(data);
                }
            );
        
        return defer.promise;
    };
    
});