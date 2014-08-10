(function (window) {
    'use strict';
    var angular = window.angular,
        app = angular.module('rateMeApp', ['ionic', 'rateMeApp.controllers', 'rateMeApp.services', 'ngCordova']);

    

    app.run(['$ionicPlatform', '$state', '$rootScope', 'AuthService', function ($ionicPlatform, $state, $rootScope, AuthService) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
            }
            // Log the user in. He/she will automatically be logged if data in localStorage,
            // and redirected to the gallery
            AuthService.login().then(
                function (data) {
                    $state.go('app.gallery');
                }
            );
            // Listen to route changes and if not correct Auth type, redirect
            $rootScope.$on('$stateChangeStart', function (event, nextState, currenState) {
                if (!nextState.data || !nextState.data.authType) {
                    return;
                }
                if (nextState.data.authType === "onlyNoAuth" && AuthService.isLoggedIn) {
                    event.preventDefault();
                    $state.go('app.gallery');
                }
                if (nextState.data.authType === "onlyAuth" && !AuthService.isLoggedIn) {
                    event.preventDefault();
                    $state.go('app.home');
                }
            });
        });
    }]);


    app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, $stateProvider, $urlRouterProvider) {

        // Home, About, Snap, Gallery, Dashboard, Settings Pages
        // Auth Types: 
        //      onlyAuth - allow user to see the page only if logged in
        //      onlyNoAuth - allow the user to see the page only if not logged in
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        });

        $stateProvider.state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html",
                    controller: 'PictureCtrl'
                }
            },
            data: {
                authType: 'onlyNoAuth'
            }
        });
        $stateProvider.state('app.about', {
            url: "/about",
            views: {
                'menuContent': {
                    templateUrl: "templates/about.html"
                }
            }
        });
        $stateProvider.state('app.snap', {
            url: "/snap",
            views: {
                'menuContent': {
                    templateUrl: "templates/snap.html",
                    controller: 'PictureCtrl'
                }
            }
        });
        $stateProvider.state('app.gallery', {
            url: "/gallery",
            views: {
                'menuContent': {
                    templateUrl: "templates/gallery/gallery.html",
                    controller: 'GalleryCtrl'
                }
            },
            data: {
                authType: 'onlyAuth'
            },
            onEnter: function ($ionicSideMenuDelegate) {
                $ionicSideMenuDelegate.canDragContent(false);
            },
            onExit: function ($ionicSideMenuDelegate) {
                $ionicSideMenuDelegate.canDragContent(true);
            }
        });
        $stateProvider.state('app.dashboard', {
            url: "/dashboard",
            views: {
                'menuContent': {
                    templateUrl: "templates/user/dashboard.html",
                    controller: 'AccountCtrl'
                }
            },
            data: {
                authType: 'onlyAuth'
            }
        });
        $stateProvider.state('app.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/user/settings.html",
                    controller: 'AccountCtrl'
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