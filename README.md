## R8M3 Hybrid Mobile App
This app communicates with our custom-made R8M3 Laravel Api so that users can anonymously snap and upload pictures for other people to rate.


### Dependencies
This project depends on multiple dependencies to make it possible to make a cross-platform, cross-device app powered with HTML, CSS, and Javascript.

- Open-source Apache Cordova project (the open-source port of Phonegap) - [link](http://cordova.apache.org/docs/en/3.5.0/index.html). We are using the following Cordova plugins:
    
    - Camera (org.apache.cordova.camera)
        
    - Console (org.apache.cordova.console)
        
    - Device (org.apache.cordova.device)
        
    - File (org.apache.cordova.file)
        
    - File-Transfer (org.apache.cordova.file-transfer)
        
    - Ionic Framework powered with Angular JS [link](http://ionicframework.com/)
    
    - Angular JS, a powerful Model-View-Controller Javascript framework [link](https://angularjs.org/)


### Starting a project using this repository
Currently, R8M3 is being developed only for Android. You must first download the Android SDK, several Android dependencies and set the appropriate system environment paths.

- Download the latest Java Development Kit (JDK), Android SDK/ADT Bundle, Apache Ant, and Node Package Manager
    
- Set environment paths to the JDK's bin folder, Android SDK's tools and platform-tools folder, and Apache Ant's bin folder
    
- Install Node Package Manager, then install the following node packages through the command line using the "npm install g <packageName>" command:
    
    - cordova
        
    - ionic

You are now ready to start an Ionic Framework/Angular JS powered project! Do the following command line commands

* ionic start <appName/folderName> <blank/tabs/sidemenu>
    
* cd <appName/folderName>
    
* cordova plugin add <pluginNames (as specified above)>
    
* cd www
    
* git clone <this repository>
    

Then Code On! When you're done coding, you will need to build your app and prepare it, and sign certificates/push it on the Android App store. Follow the instructions on Cordova and Ionic's websites.


### Helpful tools
- [Ripple Emulator](https://chrome.google.com/webstore/detail/ripple-emulator-beta/geelfhphabnejjhdalkjhgipohgpdnoc?hl=en) to emulate how Cordova with Ionic will act like on a device. No need for lengthy emulation waiting or installing on a device.