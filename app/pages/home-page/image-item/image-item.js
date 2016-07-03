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
var angularfire2_1 = require('angularfire2');
var index_1 = require("ionic-angular/index");
var edit_image_page_1 = require("../../edit-image-page/edit-image-page");
var ImageItem = (function () {
    function ImageItem(navController, angularFire) {
        this.navController = navController;
        this.angularFire = angularFire;
    }
    ImageItem.prototype.onDeleteItem = function () {
        console.log('onDeleteItem');
        this.imageItem.deleteInDatabase(this.angularFire);
    };
    ImageItem.prototype.onEditItem = function () {
        console.log('onEditItem');
        this.navController.push(edit_image_page_1.EditImagePage, { image: this.imageItem, newImage: false });
    };
    ImageItem = __decorate([
        core_1.Component({
            selector: 'image-item',
            inputs: ['imageItem'],
            templateUrl: 'build/pages/home-page/image-item/image-item.html'
        }), 
        __metadata('design:paramtypes', [index_1.NavController, angularfire2_1.AngularFire])
    ], ImageItem);
    return ImageItem;
}());
exports.ImageItem = ImageItem;
