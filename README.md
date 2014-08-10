# R8M3 Mobile App

R8M3 is a hybrid mobile application powered by [Cordova](http://cordova.apache.org/), a cross-platform mobile framework for web applications, complete with native APIs. R8M3 connects with our backend server powered by the Laravel PHP framework - the codebase for that project lives in a [different repository](https://bitbucket.org/forfronttechnology/r8m3). 


## Initializing this project

Currently, R8M3 is being developed only for Android. You must first download the Android SDK, several Android dependencies and set the appropriate system environment paths.

- Download the latest Java Development Kit (JDK), Android SDK/ADT Bundle, Apache Ant, and Node Package Manager
    
- Set environment paths to the JDK's bin folder, Android SDK's tools and platform-tools folder, and Apache Ant's bin folder

- Install [Node.js](http://nodejs.org/) into your computer.

- `git clone` this repository into a local folder

- `cd` into the folder where you cloned this repository. At the root of that folder (where you see hooks/, www/, merges/), execute `npm install` to install all of our Node.js tools. 

	* These tools help us automate certain tasks like minifying our scripts during production for faster performance of the app, automatic SASS to CSS conversion, JSDoc documentation generation, and many more. We run a task runner named [Gulp](http://gulpjs.com/). To learn more about Gulp, [go here](https://github.com/gulpjs/gulp/blob/master/README.md#gulp-----);

- `cordova platform add <platform-name>` to add a platform. In this case, we are developing on Android, so you would `cordova platform add android`. Remember to do this on the root of your local folder where this repository was cloned to.


## Helpful development tools

- [Ionic Framework](http://ionicframework.com/) is an Android 4.0^ framework that helps us develop beautiful applications. It is practically the Bootstrap of mobile development.

- [Angular](https://angularjs.org/) is a Model-View-Controller Javascript framework that keeps our logic organized, and is integrated tightly with Ionic.

- [Ripple Emulator] (https://www.npmjs.org/package/ripple-emulator) emulates how our app will work, right on our browser. 

	* `npm install ripple-emulator` on our root folder (DO NOT ADD --save or --save-dev flags because we don't want this in our package.json) and `ripple emulate` to emulate our app in the browser