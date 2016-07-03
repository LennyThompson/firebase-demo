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
var edit_image_page_1 = require('../edit-image-page/edit-image-page');
var angularfire2_1 = require("angularfire2/angularfire2");
var image_item_1 = require('./image-item/image-item');
var image_1 = require('./../../services/image/image');
var HomePage = (function () {
    function HomePage(navController, angularFire) {
        this.navController = navController;
        this.angularFire = angularFire;
        this.items = image_1.Image.loadFromDatabase(this.angularFire);
    }
    HomePage.prototype.addNewImage = function () {
        this.navController.push(edit_image_page_1.EditImagePage, { image: new image_1.Image(), newImage: true });
    };
    HomePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/home-page/home-page.html',
            directives: [image_item_1.ImageItem]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, angularfire2_1.AngularFire])
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
