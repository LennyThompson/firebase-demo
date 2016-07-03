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
var image_1 = require('../../services/image/image');
var angularfire2_1 = require("angularfire2/angularfire2");
var Rx_1 = require("rxjs/Rx");
var ScientificFactsPage = (function () {
    function ScientificFactsPage(navController, angularFire) {
        this.navController = navController;
        this.angularFire = angularFire;
        this.CATEGORY_TYPES = [{ name: 'family', display: 'Family' }, { name: 'friends', display: 'Friends' }, { name: 'work', display: 'Work' }, { name: 'other', display: 'Other' }];
        this.STATUS = [{ name: 'storage', display: 'Family' }, { name: 'local', display: 'Local' }, { name: 'deleted', display: 'Deleted' }];
        this.image = new image_1.Image();
    }
    ScientificFactsPage.prototype.saveImage = function () {
        var _this = this;
        var hourGlass = ionic_angular_1.Loading.create({
            content: 'Saving image...'
        });
        this.navController.present(hourGlass);
        this.image.saveToDatabase(this.angularFire)
            .then(function () {
            hourGlass.dismiss();
            _this.navController.pop();
        })
            .catch(function () {
            hourGlass.dismiss();
            _this.navController.pop();
        });
    };
    ScientificFactsPage.prototype.cancel = function () {
        this.navController.pop();
    };
    ScientificFactsPage.prototype.onDragStart = function (event) {
        console.log('onDragStart', event);
    };
    ScientificFactsPage.prototype.onDragEnter = function (event) {
        if (event.target.className === 'drop-zone') {
            var backColor = this.isImageFileDataTransfer(event.dataTransfer) ? 'gray' : 'pink';
            event.target.style.background = backColor;
        }
        console.log('onDragEnter', event);
    };
    ScientificFactsPage.prototype.onDragOver = function (event) {
        event.preventDefault();
    };
    ScientificFactsPage.prototype.onDrop = function (event) {
        event.preventDefault();
        if (this.isImageFileDataTransfer(event.dataTransfer)) {
            this.image.imageFile =
                {
                    file: event.dataTransfer.files[0],
                    type: event.dataTransfer.files[0].type
                };
            var readPromise = new Promise(function (resolve, reject) {
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    resolve(fileReader.result);
                };
                fileReader.readAsDataURL(event.dataTransfer.files[0]);
            });
            this.loadedImage = Rx_1.Observable.fromPromise(readPromise);
        }
    };
    ScientificFactsPage.prototype.isImageFileDataTransfer = function (dataTransfer) {
        return dataTransfer.items
            &&
                dataTransfer.items.length
            &&
                dataTransfer.items[0].kind === 'file'
            &&
                dataTransfer.items[0].type.match('^image/');
    };
    ScientificFactsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/scientific-facts-page/scientific-facts-page.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, angularfire2_1.AngularFire])
    ], ScientificFactsPage);
    return ScientificFactsPage;
}());
exports.ScientificFactsPage = ScientificFactsPage;
