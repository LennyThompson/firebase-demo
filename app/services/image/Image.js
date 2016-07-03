"use strict";
var angular2_uuid_1 = require('angular2-uuid');
var Rx_1 = require("rxjs/Rx");
var firebase_1 = require("firebase");
var Image = (function () {
    function Image() {
        this.status = 'unknown';
        this.category = 'other';
    }
    Image.prototype.saveToDatabase = function (angularFire) {
        var strUID = angular2_uuid_1.UUID.UUID().replace(/-/g, '');
        var strPath = '/images/' + angularFire.auth.getAuth().uid + '/' + strUID;
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
        var imageObj = angularFire.database.object(strPath);
        this.status = 'storage';
        this.storage = strPath;
        console.log(this);
        imageObj.set({
            name: this.name,
            description: this.description,
            comments: this.comment,
            location: this.location,
            storage: this.storage,
            status: this.status,
            category: this.category,
            created: (firebase_1.database).ServerValue.TIMESTAMP,
            updated: (firebase_1.database).ServerValue.TIMESTAMP
        });
        var imageLoadPromise = new Promise(function (resolve, reject) {
            imageTask.on(firebase_1.storage.TaskEvent.STATE_CHANGED, {
                next: function () { },
                error: function (error) { reject(error); },
                complete: function () { resolve(true); }
            });
        });
        return imageLoadPromise;
    };
    Image.loadFromDatabase = function (angularFire) {
        var strPath = '/images/' + angularFire.auth.getAuth().uid;
        var listPromises = [];
        angularFire.database.list(strPath)
            .forEach(function (imageItem) {
            if (imageItem
                &&
                    imageItem.length > 0) {
                for (var index = 0; index < imageItem.length; ++index) {
                    var strPath_1 = '/images/' + angularFire.auth.getAuth().uid + '/' + imageItem[index].$key;
                    listPromises.push(firebase_1.storage().ref().child(strPath_1).getDownloadURL()
                        .then(function (imageSrc) {
                        var imageReturn = new Image();
                        imageReturn.created = imageItem.created;
                        imageReturn.updated = imageItem.updated;
                        imageReturn.name = imageItem.name;
                        imageReturn.category = imageItem.category;
                        imageReturn.status = imageItem.status;
                        imageReturn.description = imageItem.description;
                        imageReturn.comment = imageItem.comments;
                        imageReturn.location = imageItem.location;
                        imageReturn.storage = imageItem.storage;
                        imageReturn.imageFile = imageSrc;
                        return imageReturn;
                    }));
                }
            }
        });
        return Rx_1.Observable.fromPromise(Promise.all(listPromises));
    };
    return Image;
}());
exports.Image = Image;
