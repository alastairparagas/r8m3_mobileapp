#!/usr/bin/env node
 
//  Installs our plugins every time a platform is added

var fs = require('fs');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;
var packageFile = require(path.join(process.argv[2], 'package.json'));
var cordovaPlugins = packageFile.cordovaPlugins;


console.log( "Installing Cordova plugins - Cordova Hook" );


cordovaPlugins.forEach(function(plugin) {

	exec("cordova plugin add " + plugin, function (error, errorMessage, errorCode) {
		if (error) {
			console.log( "Error encountered: " + errorMessage );
		} else {
			console.log( "Successfully added plugin: " + plugin );
		}
	});
	
});