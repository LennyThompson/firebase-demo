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
var angularfire2_1 = require("angularfire2/angularfire2");
var Rx_1 = require("rxjs/Rx");
var EditImagePage = (function () {
    function EditImagePage(navParams, navController, angularFire) {
        this.navParams = navParams;
        this.navController = navController;
        this.angularFire = angularFire;
        this.CATEGORY_TYPES = [{ name: 'family', display: 'Family' }, { name: 'friends', display: 'Friends' }, { name: 'work', display: 'Work' }, { name: 'other', display: 'Other' }];
        this.STATUS = [{ name: 'storage', display: 'Family' }, { name: 'local', display: 'Local' }, { name: 'deleted', display: 'Deleted' }];
        this.image = navParams.get('image');
        this.addNewImage = navParams.get('newImage');
        this.saveButtonText = this.addNewImage ? 'Save' : 'Update';
        this.pageTitle = this.addNewImage ? 'New Image' : 'Edit Image';
        this.updateFields = [];
    }
    Object.defineProperty(EditImagePage.prototype, "imageName", {
        get: function () {
            return this.image.name;
        },
        set: function (strName) {
            if (this.image.name !== strName) {
                this.image.name = strName;
                if (!this.updateFields.find(function (value) { return value === 'name'; })) {
                    this.updateFields.push('name');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditImagePage.prototype, "imageDescription", {
        get: function () {
            return this.image.description;
        },
        set: function (strDescription) {
            if (this.image.description !== strDescription) {
                this.image.description = strDescription;
                if (!this.updateFields.find(function (value) { return value === 'description'; })) {
                    this.updateFields.push('description');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditImagePage.prototype, "imageComment", {
        get: function () {
            return this.image.comments;
        },
        set: function (strComment) {
            if (this.image.comments !== strComment) {
                this.image.comments = strComment;
                if (!this.updateFields.find(function (value) { return value === 'comments'; })) {
                    this.updateFields.push('comments');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditImagePage.prototype, "imageLocation", {
        get: function () {
            return this.image.location;
        },
        set: function (strLocation) {
            if (this.image.location !== strLocation) {
                this.image.location = strLocation;
                if (!this.updateFields.find(function (value) { return value === 'location'; })) {
                    this.updateFields.push('location');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditImagePage.prototype, "imageCategory", {
        get: function () {
            return this.image.category;
        },
        set: function (strCategory) {
            if (this.image.category !== strCategory) {
                this.image.category = strCategory;
                if (!this.updateFields.find(function (value) { return value === 'category'; })) {
                    this.updateFields.push('category');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    EditImagePage.prototype.saveImage = function () {
        var _this = this;
        var hourGlass = ionic_angular_1.Loading.create({
            content: this.addNewImage ? 'Saving image...' : 'Updating image...'
        });
        this.navController.present(hourGlass);
        if (this.addNewImage) {
            this.image.saveToDatabase(this.angularFire)
                .then(function () {
                hourGlass.dismiss();
                _this.navController.pop();
            })
                .catch(function () {
                hourGlass.dismiss();
                _this.navController.pop();
            });
        }
        else {
            this.image.updateInDatabase(this.updateFields, this.angularFire)
                .then(function () {
                hourGlass.dismiss();
                _this.navController.pop();
            })
                .catch(function () {
                hourGlass.dismiss();
                _this.navController.pop();
            });
        }
    };
    EditImagePage.prototype.cancel = function () {
        this.navController.pop();
    };
    EditImagePage.prototype.onDragStart = function (event) {
        console.log('onDragStart', event);
    };
    EditImagePage.prototype.onDragEnter = function (event) {
        if (event.target.className === 'drop-zone') {
            var backColor = this.isImageFileDataTransfer(event.dataTransfer) ? 'gray' : 'pink';
            event.target.style.background = backColor;
        }
        console.log('onDragEnter', event);
    };
    EditImagePage.prototype.onDragOver = function (event) {
        event.preventDefault();
    };
    EditImagePage.prototype.onDrop = function (event) {
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
    EditImagePage.prototype.isImageFileDataTransfer = function (dataTransfer) {
        return Boolean(dataTransfer.items
            &&
                dataTransfer.items.length
            &&
                dataTransfer.items[0].kind === 'file'
            &&
                dataTransfer.items[0].type.match('^image/'));
    };
    EditImagePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/edit-image-page/edit-image-page.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.NavController, angularfire2_1.AngularFire])
    ], EditImagePage);
    return EditImagePage;
}());
exports.EditImagePage = EditImagePage;
