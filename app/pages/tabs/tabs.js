"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var home_page_1 = require('../home-page/home-page');
var about_page_1 = require('../about-page/about-page');
var contact_page_1 = require('../contact-page/contact-page');
var angularfire2_1 = require("angularfire2/angularfire2");
var database = firebase.database;
var TabsPage = (function () {
    function TabsPage(navParams, angularFire) {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.navParams = navParams;
        this.tab1Root = home_page_1.HomePage;
        this.tab2Root = about_page_1.AboutPage;
        this.tab3Root = contact_page_1.ContactPage;
        var strPath = '/users/' + angularFire.auth.getAuth().uid;
        this.user = angularFire.database.object(strPath);
        if (navParams.get('newUser')) {
            this.user = angularFire.database.object(strPath);
            var userCreate = {
                name: navParams.get('email'),
                surname: '',
                email: navParams.get('email'),
                created: database.ServerValue.TIMESTAMP,
                updated: database.ServerValue.TIMESTAMP
            };
            this.user.set(userCreate);
        }
        else {
            this.user = angularFire.database.object(strPath);
        }
    }
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/tabs/tabs.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, angularfire2_1.AngularFire])
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
