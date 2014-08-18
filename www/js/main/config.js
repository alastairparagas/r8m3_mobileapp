/**
   @module rateMe
   @description rateMe is the global module of our application. It ties in all of our other angular modules together, from our camera, gallery,
   authorization, user information/settings, and other modules, as well as other dependencies like the Ionic Framework and ngCordova.
   @author Alastair Paragas <alastairparagas@gmail.com>
   @requires {@link http://ionicframework.com/docs/api/|module:ionic}
   @requires {@link http://ngcordova.com/docs/|module:ngCordova}
   @requires {@link module:rateMe/utility}
   @requires {@link module:rateMe/camera}
   @requires {@link module:rateMe/gallery}
   @requires {@link module:rateMe/user}
*/
(function (window) {
    'use strict';
	var angular = window.angular,
		app = angular.module('rateMe', ['ionic', 'ngCordova', 'rateMe.utility', 'rateMe.camera', 'rateMe.gallery', 'rateMe.user']);
    
    
	app.run(['$ionicPlatform', 'AuthService', '$state', '$rootScope', function ($ionicPlatform, AuthService, $state, $rootScope) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                window.StatusBar.styleDefault();
            }
        });
        
        AuthService.login().then(
            function (data) {
                $state.go('app.gallery-home');
            }
        );
        
        $rootScope.$on('$stateChangeStart', function (event, nextState) {
            if (!nextState.data || !nextState.data.authType) {
                return;
            }
            if (nextState.data.authType === "onlyNoAuth" && AuthService.isLoggedIn()) {
                event.preventDefault();
                $state.go('app.gallery-home');
            }
            if (nextState.data.authType === "onlyAuth" && !AuthService.isLoggedIn()) {
                event.preventDefault();
                $state.go('app.home');
            }
        });
    }]);


    app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, $stateProvider, $urlRouterProvider) {
        
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "js/main/partials/menu.html",
            controller: 'AppCtrl'
        });
        $stateProvider.state('app.home', {
            url: "/home",
            views: {
                'appContent': {
                    templateUrl: "js/main/partials/home.html"
                }
            },
            data: {
                authType: 'onlyNoAuth'
            }
        });
        
        $stateProvider.state('app.gallery-home', {
            url: "/gallery-home",
            views: {
                'appContent': {
                    templateUrl: "js/gallery/partials/gallery.html",
                    controller: 'GalleryCtrl'
                }
            },
            data: {
                authType: 'onlyAuth'
            },
            onEnter: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                $ionicSideMenuDelegate.canDragContent(false);
            }],
            onExit: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                $ionicSideMenuDelegate.canDragContent(true);
            }]
        });
        
        $stateProvider.state('app.camera-snap', {
            url: "/camera-snap",
            views: {
                'appContent': {
                    templateUrl: "js/camera/partials/snap.html",
                    controller: 'CameraSnapCtrl'
                }
            }
        });
        $stateProvider.state('app.camera-upload', {
            url: "/camera-upload",
            views: {
                'appContent': {
                    templateUrl: "js/camera/partials/upload.html",
                    controller: 'CameraUploadCtrl'
                }
            }
        });
        
        $stateProvider.state('app.user-dashboard', {
            url: "/user-dashboard",
            views: {
                'appContent': {
                    templateUrl: "js/user/partials/dashboard.html",
                    controller: 'UserDashboardCtrl'
                }
            },
            data: {
                authType: 'onlyAuth'
            }
        });
        $stateProvider.state('app.user-settings', {
            url: "/user-settings",
            views: {
                'appContent': {
                    templateUrl: "js/user/partials/settings.html",
                    controller: 'UserSettingsCtrl'
                }
            },
            data: {
                authType: 'onlyAuth'
            }
        });
        
        $urlRouterProvider.otherwise('/app/home');

        $httpProvider.defaults.useXDomain = true;

    }]);
    
    
    
}(window));