angular.module('rateMeApp.services').service('GalleryService', function(AuthService, $cordovaNetwork, $cordovaToast, $http){
    
    var pictures = (localStorage.pictures && JSON.parse(localStorage.pictures)) || {};
    var pictureCounter = 0;
    
    // Gets random pictures from server for user to view and rate and adds them
    // to our pictures associative array.
    // First parameter: orderBy: created_at, raters_count, rating
    // Second parameter: limit: how many images to gather per pull
    this.getNewPictures = function(orderBy, limit){
        var defer = $q.defer();
        var postOptions = {};
        var orderBy = orderBy || null;
        var limit = parseInt(limit) || 30;
        
        if($cordovaNetwork.isOffline()){
            $cordovaToast.show("No internet connection. Cannot retrive images.", "long", "bottom");
            defer.reject({message: "No internet connection. Cannot retrieve images."});
            return defer.promise;
        }
        
        if(orderBy !== null){
            postOptions.orderBy = orderBy;
        }
        
        if(typeof limit === "number"){
            postOptions.limit = limit;   
        }
        
        $http.post("http://myrighttoplay.com/R8M3/public/api/v1/image/view", postOptions).success(function(data){
            if(pictureCounter > 150){
                 pictures = {}
                 pictureCounter = 0;
            }
            for(var i = 0, len = data.info.length; i < len; i++){
                currentImage = data.info[i];
                pictures[currentImage.id] = currentImage;
                pictureCounter++;
            }
            localStorage.pictures = pictures;
            defer.resolve(pictures);
        }).error(function(data){
            defer.reject({message: "Cannot retrieve images. " + data.message});
        });
        
        return defer.promise;
    };
    
    
    // Gets all of the pictures
    this.getPictures = function(){
        return pictures;   
    };
    
    
    // Returns length of Pictures 'Array'
    this.countPictures = function(){
        return pictureCounter;   
    };
    
    
    // Gets a picture's information given an imageId.
    // Returns an object holding information about the image.
    this.getPicture = function(imageId){
        return pictures[imageId] || null;
    };
    
    // Gets a picture's information based on its index in 
    // picture's associative array (object).
    this.getPictureAtIndex = function(index){
        var iterator = 0;
        for(imageId in pictures){
            if(!pictures.hasOwnProperty(imageId)){
               continue;
            }
            if(iterator == index){
                return pictures[imageId];   
            }
            iterator++;
        }
        return null;
    };
    
    
    this.ratePicture = function(imageId, score){
        
    };
    
});