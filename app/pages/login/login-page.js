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
var tabs_1 = require('./../tabs/tabs');
var new_user_page_1 = require('./new-user/new-user-page');
var user_1 = require('./../../services/user/user');
var angularfire2_1 = require('angularfire2');
var LoginPage = (function () {
    function LoginPage(navController, fireAuth) {
        this.navController = navController;
        this.fireAuth = fireAuth;
        this.user = new user_1.User('', '');
    }
    LoginPage.prototype.onClickLogin = function () {
        var _this = this;
        console.log('login: user ', this.user.name, ', password ', this.user.password);
        this.fireAuth.login({ email: this.user.name, password: this.user.password })
            .then(function (status) {
            _this.navController.push(tabs_1.TabsPage, { email: _this.user.name, newUser: false });
        });
    };
    LoginPage.prototype.onClickNewUser = function () {
        this.navController.push(new_user_page_1.NewUserPage);
    };
    LoginPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/login/login-page.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, angularfire2_1.FirebaseAuth])
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
