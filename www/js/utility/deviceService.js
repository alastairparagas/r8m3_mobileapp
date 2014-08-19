/**
    @ngdoc service
    @name DeviceService
    @description Returns information about the device and stores/gets important information about the device such as the resolution of the camera/pictures taken from the first/first-few uploads, which will allow us to gauge about the quality that we need to set for the resolution of the camera to speed up future uploads.
*/
(function (window) {
    'use strict';
    var angular = window.angular;
    
    
    
    angular.module('rateMe.utility').service('DeviceService', ['$cordovaDevice', function ($cordovaDevice) {
        
        
        /**
            @memberof DeviceService
            @description The current user's device's UUID (Universally Unique Identifier Number). This is for the most part, unique, there is a microscropic possibility of similarity between two UUIDs.
        */
        this.uuid = $cordovaDevice.getUUID();
        
        
        /**
            @memberof DeviceService
            @description Returns the device's operating system name - ["Android", "Blackberry", "iPhone", "webOS", "WinCE"]
        */
        this.platform = $cordovaDevice.getPlatform();
        
        
        /**
            @memberof DeviceService
            @description The version of the user's platform. For example, Android 2.2 would return "2.2", iOS 3.2 would return "3.2", and so forth.
        */
        this.platformVersion = $cordovaDevice.getVersion();
        
        
        /**
            @memberof DeviceService
            @description Returns the current version of the Cordova that wraps the application.
        */
        this.cordovaVersion = $cordovaDevice.getCordova();
        
        
        /**
            @memberof DeviceService
            @description Returns the device model - set by manufacturer, and can be different even across same phone models.
        */
        this.deviceModel = $cordovaDevice.getModel();
        
        
        /**
            @memberof DeviceService
            @var device
            @description Holds some information we have collected about the user's device such as whether this is first time they have used the device, and also holds some information about their first image snap so we can augment the output image and speed up the upload as a result.
            @private
        */
        var device = (localStorage.device && JSON.parse(localStorage.device)) || {
            firstTime: true,
            firstSnap: null,
            snaps: []
        };
        
        
        /**
            @memberof DeviceService
            @description Returns whether this is the user's first time using the app or not.
        */
        this.isFirstTime = function () {
            return device.firstTime;
        };
        
        
        /**
            @memberof DeviceService
            @description Note the fact that this is not the user's first time anymore.
        */
        this.removeFirstTime = function () {
            device.firstTime = false;
            localStorage.device = JSON.stringify(device);
        };
        
        
        /**
            @memberof DeviceService
            @description Roughly estimates the phone's camera resolution based on the first snap of the camera, so that we can depress the quality of the subsequent shots to speed up file upload.
        */
        this.getCameraInfo = function () {
            return device.firstSnap;
        };
        
        
        /**
            @memberof DeviceService
            @description Sets the firstSnap if this is the first snap by the user, else, store it as an array to snaps property of device object to do better guestimations in the future.
        */
        this.setCameraInfo = function (metadata) {
            if (device.firstSnap === null) {
                device.firstSnap = metadata;
            } else {
                if (device.snaps.length > 9) {
                    device.snaps.shift();
                }
                device.snaps.push(metadata);
            }
            localStorage.device = JSON.stringify(device);
        };
        
        
    }]);
    
    
    
}(window));