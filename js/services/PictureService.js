angular.module('rateMeApp.services').service('PictureService', function(AuthService, $q, $cordovaNetwork, $cordovaToast, $cordovaFile, $cordovaCamera){
    
    this.getLimit = 30;
    this.picCounter = 0;
    this.pictureList = [];
    
    
    // Provides the Camera interface and the whole picture upload/page redirection magic.
    this.takePicture = function(){
        // Asynchrous preparation
        var defer = $q.defer();
        
        // Cordova Camera Options https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
        var options = { 
            quality : 100, 
            destinationType : Camera.DestinationType.FILE_URI, 
            correctOrientation: true,
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : false,
            encodingType: Camera.EncodingType.PNG,
            saveToPhotoAlbum: false
        };
        // Take a picture, redirect to page with passed image location
        $cordovaCamera.getPicture(options).then(function(imageData) {
            defer.resolve(imageData);
        }, function(err) {
            defer.reject({message: "Picture not taken: " + err});
        });
        
        return defer.promise;
    };
    
    
    // Uploads a picture given the file path
    this.uploadPicture = function(filePath){
        var defer = $q.defer();
        var uploadUrl;
        
        // Pictures can only be taken after 10 minute increments
        if( localStorage.lastSnap && new Date().getTime() - localStorage.lastSnap < 600000 ){
            $cordovaToast.show("Pictures can only be taken in 10 minute increments.", "long", "bottom");
            defer.reject({message: "Pictures can only be taken after 10 minute increments."});
            return defer.promise;
        }
        
        // Cordova File Transfer Options https://github.com/apache/cordova-plugin-file-transfer/blob/master/doc/index.md
        var options = {
            fileKey: "image_file_actual",
            mimeType: "image/png"
        }
        
        if(AuthService.isLoggedIn === true){
            uploadUrl = "http://myrighttoplay.com/R8M3/public/api/v1/image/add";
            options.headers = AuthService.returnAuthHeaders();
        }else{
            uploadUrl = "http://myrighttoplay.com/R8M3/public/api/v1/image/add-guest";  
        }
        
        $cordovaFile.uploadFile(uploadUrl, filePath, options)
        .then(
            function (data){
                defer.resolve(JSON.parse(data.response));
                localStorage.lastSnap = new Date().getTime();
            },
            function (data){
                defer.reject(data);
            },
            function (data){
                defer.notify(data);   
            }
        );
        
        return defer.promise;
    };
    
    
    // Gets random pictures from server for user to rate.
    // First parameter - order by: id, popularity, random
    this.getPictures = function(){
        
    };
    
    
    // Gets a picture's information given an imageId.
    // Returns an object holding information about the image.
    this.getPicture = function(imageId){
          
    };
    
});