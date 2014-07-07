var app = angular.module('rateMeApp', ['ionic', 'rateMeApp.controllers', 'rateMeApp.services', 'ngCordova']);

app.run(function($ionicPlatform, $rootScope, $location, AuthService) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        // Log the user in. He/she will automatically be logged in if he/she logged in before.
        // And stuff are in LocalHost
        AuthService.login();
        
        // Check logged in state for certain routes
    });
});

app.config(function($httpProvider, $stateProvider, $urlRouterProvider) {

    // Home, guestSnap, dashboard, gallery, gallerySingle views
    $stateProvider.state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    });
    $stateProvider.state('app.home', {
        url: "/home",
        views: {
            'menuContent' :{
                templateUrl: "templates/home.html"
            }
        }
    });
    $stateProvider.state('app.about', {
        url: "/about",
        views: {
            'menuContent' :{
                templateUrl: "templates/about.html"
            }
        }
    });
    $stateProvider.state('app.snap', {
        url: "/snap",
        views: {
            'menuContent' :{
                templateUrl: "templates/snap.html",
                controller: 'PictureCtrl'
            }
        }
    });
    $stateProvider.state('app.gallery', {
        url: "/gallery",
        views: {
            'menuContent' :{
                templateUrl: "templates/gallery/gallery.html",
                controller: 'PictureCtrl'
            }  
        }
    });
    $stateProvider.state('app.gallerySingle', {
        url: "/gallery/:imageId",
        views: {
            'menuContent' :{
                templateUrl: "templates/gallery/gallerySingle.html",
                controller: 'PictureCtrl'
            }
        }
    });
    $stateProvider.state('app.dashboard', {
        url: "/dashboard",
        views: {
            'menuContent' :{
                templateUrl: "templates/user/dashboard.html",
                controller: 'AccountCtrl'
            }
        }
    });
    $stateProvider.state('app.settings', {
        url: "/settings",
        views: {
            'menuContent' :{
                templateUrl: "templates/user/settings.html",
                controller: 'AccountCtrl'
            }
        }
    });
    $urlRouterProvider.otherwise('/app/home');
    
    $httpProvider.defaults.useXDomain = true;

});

