angular.module('rateMeApp.services').service('GalleryService', function(AuthService, $cordovaNetwork, $cordovaToast, $http, $q){
    
    var pictures = (localStorage.pictures && JSON.parse(localStorage.pictures)) || {};
    var pictureCounter = Object.keys(pictures).length;
    
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
            // For image provided image
            for(var i = 0, len = data.info.length; i < len; i++){
                currentImage = data.info[i];
                // If first image in set, check if it's the same as localStorage's first image. If they are, same set of images - do not concatenate to localStorage!
                if(i === 0){
                    if(currentImage.id in pictures){
                        break;
                    }
                }
                // If current user is in the ratees list of image, they rated this image already. Do appropriate manipulation of object so we can notify view/controller
                if(AuthService.userid && AuthService.userid != 0){
                    for(var currentRatee = 0, ratees = currentImage.ratees, rateesCount = ratees.length; currentRatee < rateesCount; currentRatee++){
                        if(AuthService.userid == ratees[currentRatee].user_id){
                            currentImage.hasRated = true;
                        }
                    }
                }
                pictures[currentImage.id] = currentImage;
                delete currentImage.ratees;
                pictureCounter++;
            }
            localStorage.pictures = JSON.stringify(pictures);
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
        for(var imageId in pictures){
            if(!pictures.hasOwnProperty(imageId)){
               continue;
            }
            if(iterator === index){
                return pictures[imageId];   
            }
            iterator++;
        }
        return null;
    };
    
    
    this.ratePicture = function(imageId, score){
        
    };
    
});