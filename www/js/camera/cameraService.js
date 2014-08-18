/**
    @ngdoc service
    @name CameraService
    @description Angular Service that handles taking and uploading pictures from the user's device to the server. Public methods: snapPicture(), picturepilePicture() [not yet coded], getPicture(), getPictureMetaData(), and uploadPicture().
*/
(function (window) {
    'use strict';
    var angular = window.angular,
        jic = window.jic;
    
    
    
    angular.module('rateMe.camera').service('CameraService', ['$q', '$cordovaNetwork', '$cordovaFile', '$cordovaCamera', 'AuthService', 'ErrorService', function ($q, $cordovaNetwork, $cordovaFile, $cordovaCamera, AuthService, ErrorService) {
        
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
            pictureMetaData = null,
        /**
            @memberof CameraService
            @var {String|Null} compressedPicture
            @description String that represents the compressed picture in the form of a DomString.
            @private
        */
            compressedPicture = null,
        /**
            @memberof CameraService
            @var {String|Null} compressedPictureDom
            @description DOM img element holding reference to the compressed image data.
            @private
        */
            compressedPictureDom = null;
        
        /**
            @memberof CameraService
            @description Resets the currently represented picture.
            @private
        */
        function resetPicture() {
            picture = null;
            pictureMetaData = null;
            compressedPicture = null;
            compressedPictureDom = null;
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
                };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                picture = imageData;
                $cordovaFile.readFileMetadataAbsolute(imageData).then(
                    function (imageMetaData) {
                        pictureMetaData = imageMetaData;
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
            @description Lets the user choose a picture from the device's picture gallery/set, and sets whatever picture that is chosen as the represented picture by this service.
        */
        this.picturepilePicture = function () {
            
        };
        
        
        /**
            @memberof CameraService
            @description Compresses the image object that is referenced by the passed in imageDomId and stores it in our private compressedImage variable.
            @argument {String} imageDomId - ID of the DOM img element whose src is an image that will be compressed.
        */
        this.compressPicture = function (imageDomId) {
            if (typeof imageDomId === "string" && pictureMetaData.size) {
                compressedPicture = jic.compress(window.document.getElementById(imageDomId), Math.floor(50000 / pictureMetaData.size * 100)).src;
            }
        };
        
        
        /**
            @memberof CameraService
            @description Returns the absolute path of the picture that was obtained either from the device's camera or picture gallery.
            @argument {String} [imageDomId] - DOM id of the img element that will hold the compressed image, and the same img element that will be used as a reference of the binary compressed image data to upload to the server.
            @return {String|Null} "compressed" if the image is compressed and an imageDomId is provided, Path of the picture otherwise, and null if there is no current picture on hold.
        */
        this.getPicture = function (imageDomId) {
            if (typeof picture === "string" && picture) {
                if (compressedPicture) {
                    compressedPictureDom = window.document.getElementById(imageDomId);
                    return compressedPicture;
                }
                
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
            @description Uploads a picture, given the picture's file path, to the server for a normal upload, or uploads the compressed image using JIC if using the smartUpload setting. Checks if the device is online, that the 10-minute anti-spam period is up, and that the provided filePath is of a correct type before trying to upload to the server.
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

            if (AuthService.getSetting('smartUpload') && compressedPictureDom !== null) {
                jic.upload(compressedPictureDom, uploadUrl, options.fileKey, "image.jpg", function (data) {
                    window.console.log("SUCCESS! USED JIC TO UPLOAD");
                    defer.resolve(JSON.parse(data));
                    localStorage.lastSnap = new Date().getTime();
                    resetPicture();
                }, function (data) {
                    var dataObject = JSON.parse(data);
                    ErrorService.setError('CameraService', dataObject.message);
                    defer.reject(dataObject);
                }, function (progressCount) {
                    defer.notify(progressCount);
                });
            } else {
                $cordovaFile.uploadFile(uploadUrl, picture, options)
                    .then(
                        function (data) {
                            window.console.log("SUCCESS! USED CORDOVA FILE TO UPLOAD");
                            defer.resolve(JSON.parse(data.response));
                            localStorage.lastSnap = new Date().getTime();
                            resetPicture();
                        },
                        function (data) {
                            if (data.message) {
                                ErrorService.setError('CameraService', data.message);
                            }
                            defer.reject(data);
                        },
                        function (data) {
                            defer.notify(data);
                        }
                    );
            }
            
            return defer.promise;
        };
        
        
    }]);
    
    
    
}(window));