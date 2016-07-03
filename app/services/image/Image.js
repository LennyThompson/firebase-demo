"use strict";
var angular2_uuid_1 = require('angular2-uuid');
var Rx_1 = require("rxjs/Rx");
var firebase_1 = require("firebase");
require('rxjs/add/operator/map');
var Image = (function () {
    function Image() {
        this.status = 'unknown';
        this.category = 'other';
    }
    Image.prototype.saveToDatabase = function (angularFire) {
        var _this = this;
        var strUID = angular2_uuid_1.UUID.UUID().replace(/-/g, '');
        var strPath = '/images/' + angularFire.auth.getAuth().uid + '/active/' + strUID;
        var imageObj = angularFire.database.object(strPath);
        this.status = 'storage';
        this.storage = strPath;
        var imageLoadPromise;
        var imageRef = firebase_1.storage().ref();
        var imageMetadata = {
            contentType: this.imageFile.type,
            cacheControl: null,
            contentDisposition: null,
            contentEncoding: null,
            contentLanguage: null,
            customMetadata: null,
            md5Hash: null
        };
        var imageTask = imageRef.child(strPath).put(this.imageFile.file, imageMetadata);
        imageLoadPromise = new Promise(function (resolve, reject) {
            imageTask.on(firebase_1.storage.TaskEvent.STATE_CHANGED, {
                next: function () {
                },
                error: function (error) {
                    reject(error);
                },
                complete: function () {
                    resolve(true);
                }
            });
        })
            .then(function () {
            imageObj.set({
                name: _this.name,
                description: _this.description,
                comments: _this.comments,
                location: _this.location,
                storage: _this.storage,
                status: _this.status,
                category: _this.category,
                created: firebase_1.database.ServerValue.TIMESTAMP,
                updated: firebase_1.database.ServerValue.TIMESTAMP
            });
            return true;
        });
        return imageLoadPromise;
    };
    Image.prototype.deleteInDatabase = function (angularFire) {
        var strRemovePath = '/images/' + angularFire.auth.getAuth().uid + '/' + this.key;
        angularFire.database.object(strRemovePath).remove();
        var strPath = '/images/' + angularFire.auth.getAuth().uid + '/deleted/' + this.key;
        var imageObj = angularFire.database.object(strPath);
        return imageObj.set({
            name: this.name,
            description: this.description,
            comments: this.comments,
            location: this.location,
            storage: this.storage,
            status: 'deleted',
            category: this.category,
            created: this.created,
            updated: firebase_1.database.ServerValue.TIMESTAMP
        });
    };
    // Given a list of updated fields update them to the database obejct
    Image.prototype.updateInDatabase = function (listFields, angularFire) {
        // Set up an obejct to contain the update data
        var _this = this;
        var updateData = {
            updated: firebase_1.database.ServerValue.TIMESTAMP
        };
        listFields.forEach(function (propertyName) {
            updateData[propertyName] = _this[propertyName];
        });
        // Now update the data
        var strPath = '/images/' + angularFire.auth.getAuth().uid + '/active/' + this.key;
        return angularFire.database.object(strPath).update(updateData);
    };
    // Load the image description information and the image itself (from storage)
    Image.loadFromDatabase = function (angularFire) {
        var strPath = '/images/' + angularFire.auth.getAuth().uid + '/active';
        var listPromises = [];
        // Load a list of images from the path as an observable (set)...
        return angularFire.database.list(strPath)
            .map(function (imageList) {
            if (imageList
                &&
                    imageList.length > 0) {
                // Now map the image list to a list of Image objects
                return imageList.map(function (imageItem) {
                    var imageReturn = new Image();
                    imageReturn.created = imageItem.created;
                    imageReturn.updated = imageItem.updated;
                    imageReturn.name = imageItem.name;
                    imageReturn.category = imageItem.category;
                    imageReturn.status = imageItem.status;
                    imageReturn.description = imageItem.description;
                    imageReturn.comments = imageItem.comments;
                    imageReturn.location = imageItem.location;
                    imageReturn.storage = imageItem.storage;
                    // Retain the key so we can rebuild the path to the database object(s)
                    imageReturn.key = imageItem.$key;
                    // Read the image storage object, and return the image (this will be access with async in the UI)
                    var strPath = '/images/' + angularFire.auth.getAuth().uid + '/' + imageItem.$key;
                    imageReturn.imageFile = Rx_1.Observable.fromPromise(firebase_1.storage().ref().child(strPath).getDownloadURL()
                        .catch(function (error) {
                        console.log('image does not exist');
                    }));
                    return imageReturn;
                });
            }
        });
    };
    return Image;
}());
exports.Image = Image;
