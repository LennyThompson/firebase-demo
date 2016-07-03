/// <reference path="./../node_modules/angularfire2/firebase3.d.ts" />

import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {LoginPage} from './pages/login/login-page';
import {FirebaseUrl, FIREBASE_PROVIDERS, defaultFirebase, firebaseAuthConfig, AuthProviders, AuthMethods} from 'angularfire2';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(
    MyApp, 
    [
        FIREBASE_PROVIDERS, 
        defaultFirebase(
        // Initialize Firebase - need to copy this from the firebase console 'WEB SETUP'
        {
            apiKey: "AIzaSyDRC967G6VYdiZLjOgLh6l6fabmDk_k9WI",
            authDomain: "mydodgyapp.firebaseapp.com",
            databaseURL: "https://mydodgyapp.firebaseio.com",
            storageBucket: "mydodgyapp.appspot.com"
        }
        ),
        firebaseAuthConfig(
            {
                provider: AuthProviders.Password,
                method: AuthMethods.Password,
                remember: 'default',
                scope: ['email']
            }
        )
    ]
);
