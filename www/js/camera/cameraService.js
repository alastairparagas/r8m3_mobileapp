/**
    @ngdoc service
    @name CameraService
    @description Angular Service that handles taking and uploading pictures from the user's device to the server. Public methods: snapPicture(), picturepilePicture() [not yet coded], getPicture(), getPictureMetaData(), and uploadPicture().
*/
(function (window) {
    'use strict';
    var angular = window.angular;
    
    
    
    angular.module('rateMe.camera').service('CameraService', ['$q', '$cordovaNetwork', '$cordovaFile', '$cordovaCamera', 'AuthService', 'ErrorService', 'DeviceService', function ($q, $cordovaNetwork, $cordovaFile, $cordovaCamera, AuthService, ErrorService, DeviceService) {
        
        /**
            @memberof CameraService
            @var {String} picture
            @description Represents the current picture. Null if none, a path of the actual image file if available. The path can be an image taken from the camera or the user's photo gallery.
            @private
        */
        var picture = null,
        /**
            @memberof CameraService
            @var {Object} pictureMetaData
            @description Object that represents the picture's metadata.
            @private
        */
            pictureMetaData = null;
        /**
            @memberof CameraService
            @description Resets the currently represented picture.
            @private
        */
        function resetPicture() {
            picture = null;
            pictureMetaData = null;
        }
        
        
        /**
            @memberof CameraService
            @description Takes pictures by using the phone's built in camera. This provides our camera interface, which is currently on produced by the native Cordova camera plugin and whose UI cannot be tweaked unless we ourselves make a native Cordova Camera plugin.
            @returns {HttpPromise} Promise resolved on success, rejected on failure.
            @see {@link https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md Cordova Camera options}
        */
        this.snapPicture = function () {
            resetPicture();
            
            var defer = $q.defer(),
                options = {
                    destinationType : window.Camera.DestinationType.FILE_URI,
                    correctOrientation: true,
                    sourceType : window.Camera.PictureSourceType.CAMERA,
                    allowEdit : false,
                    saveToPhotoAlbum: false,
                    encodingType: window.Camera.EncodingType.JPEG
                },
                cameraInfo = DeviceService.getCameraInfo(),
                cameraCompression = AuthService.getSetting("compressionRating");
            
            if (AuthService.getSetting("smartUpload") === true) {
                options.quality = (cameraInfo && cameraInfo.size > cameraCompression && Math.floor(cameraCompression / cameraInfo.size * 50)) || 50;
            }

            $cordovaCamera.getPicture(options).then(function (imageData) {
                picture = imageData;
                $cordovaFile.readFileMetadataAbsolute(imageData).then(
                    function (imageMetaData) {
                        pictureMetaData = imageMetaData;
                        DeviceService.setCameraInfo(imageMetaData);
                        defer.resolve({image: imageData, metadata: imageMetaData});
                    },
                    function (error) {
                        defer.resolve({image: imageData});
                    }
                );
            }, function (error) {
                ErrorService.setError('CameraService', "Picture not taken because of a device error.");
                defer.reject({message: "Picture not taken: " + error});
            });

            return defer.promise;
            
        };
        
        
        /**
            @memberof CameraService
            @description Returns the absolute path of the picture that was obtained from the device's camera.
            @return {String|Null} Path of the picture if set, Null if not set.
        */
        this.getPicture = function () {
            if (typeof picture === "string" && picture) {
                return picture;
            }
            
            return null;
        };
        
        
        /**
            @memberof CameraService
            @description Returns the metadata of the picture if a picture exists and it contains a metadata. Else, it returns an empty object.
            @returns {Object} Object that holds the metadata of the captured picture. Empty Object if there is no available metadata.
        */
        this.getPictureMetaData = function () {
            if (picture && typeof picture === "string" && pictureMetaData !== null) {
                return pictureMetaData;
            }
            
            return {};
        };
        
        
        /**
            @memberof CameraService
            @description Uploads a picture, given the picture's file path, to the server. Checks if the device is online, that the 10-minute anti-spam period is up, and that the provided filePath is of a correct type before trying to upload to the server.
            @returns {HttpPromise} Promise resolved on success, rejected on failure.
            @see {@link https://github.com/apache/cordova-plugin-file-transfer/blob/master/doc/index.md Cordova File Transfer Options}
        */
        this.uploadPicture = function () {
            
            var defer = $q.defer(),
                uploadUrl,
                options = {
                    fileKey: "image_file_actual",
                    mimeType: "image/png"
                };
            
            if (localStorage.lastSnap && new Date().getTime() - localStorage.lastSnap < 600000) {
                ErrorService.setError('CameraService', "Pictures can only be taken in 10 minute increments.");
                defer.reject({message: "Pictures can only be taken in 10 minute increments."});
                return defer.promise;
            }
            
            if ($cordovaNetwork.isOffline()) {
                ErrorService.setError('CameraService', "Cannot upload image - no internet connection.");
                defer.reject({message: "No internet connection. Cannot upload."});
                return defer.promise;
            }
            
            if (typeof picture === "undefined" || picture === null) {
                ErrorService.setError('CameraService', "The file does not exist/invalid file path.");
                defer.reject({message: "File/Path doesn't exist"});
                return defer.promise;
            }

            if (AuthService.isLoggedIn()) {
                uploadUrl = "http://myrighttoplay.com/R8M3/public/api/v1/image/add";
                options.headers = AuthService.authHeaders();
            } else {
                uploadUrl = "http://myrighttoplay.com/R8M3/public/api/v1/image/add-guest";
            }

            $cordovaFile.uploadFile(uploadUrl, picture, options)
                .then(
                    function (data) {
                        defer.resolve(JSON.parse(data.response));
                        localStorage.lastSnap = new Date().getTime();
                        resetPicture();
                        $cordovaCamera.cleanup();
                    },
                    function (data) {
                        if (data.message) {
                            ErrorService.setError('CameraService', data.message);
                        }
                        defer.reject(data);
                    },
                    function (data) {
                        if (data.lengthComputable === true) {
                            defer.notify({loaded: data.loaded, total: data.total});
                        }
                    }
                );
            
            return defer.promise;
        };
        
        
    }]);
    
    
    
}(window));