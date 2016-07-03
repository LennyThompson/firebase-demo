import {AngularFire} from "angularfire2/angularfire2";
import {UUID} from 'angular2-uuid';
import {Observable} from "rxjs/Rx";
import { database, storage } from "firebase";
import { map } from 'rxjs/add/operator/map';

export class Image {

    public name: string;
    public comment: string;
    public description: string;
    public location: string;
    public storage: string;
    public status: string;
    public category: string;
    public imageFile: any;
    public created: number;
    public updated: number;

    constructor ()
    {
        this.status = 'unknown';
        this.category = 'other';
    }

    saveToDatabase(angularFire: AngularFire): Promise<boolean>
    {
        let strUID: string = UUID.UUID().replace(/-/g, '');
        let strPath: string = '/images/' + angularFire.auth.getAuth().uid + '/' + strUID;
        let imageRef = storage().ref();
        let imageMetadata = {
            contentType: this.imageFile.type,
            cacheControl: null,
            contentDisposition: null,
            contentEncoding: null,
            contentLanguage: null,
            customMetadata: null,
            md5Hash: null
        };
        let imageTask = imageRef.child(strPath).put(this.imageFile.file, imageMetadata);
        let imageObj = angularFire.database.object(strPath);
        this.status = 'storage';
        this.storage = strPath;
        console.log(this);
        imageObj.set
        (
            {
                name: this.name,
                description: this.description,
                comments: this.comment,
                location: this.location,
                storage: this.storage,
                status: this.status,
                category: this.category,
                created: <any>(database).ServerValue.TIMESTAMP,
                updated: <any>(database).ServerValue.TIMESTAMP
            }
        );
        let imageLoadPromise = new Promise<boolean>(
            (resolve, reject) =>
            {
                imageTask.on(storage.TaskEvent.STATE_CHANGED,
                    {
                        next: () => {},
                        error: (error) => { reject(error); },
                        complete: () => { resolve(true); }
                    }
                );
            }
        );
        return imageLoadPromise;
    }

    static loadFromDatabase(angularFire: AngularFire): any
    {
        let strPath = '/images/' + angularFire.auth.getAuth().uid;
        let listPromises = [];
        return angularFire.database.list(strPath)
            .map(
                (imageList: any) =>
                {
                    if
                    (
                        imageList
                        &&
                        imageList.length > 0
                    ) 
                    {
                        return imageList.map(
                            (imageItem : any) =>
                            {
                                let imageReturn:Image = new Image();
                                imageReturn.created = imageItem.created;
                                imageReturn.updated = imageItem.updated;
                                imageReturn.name = imageItem.name;
                                imageReturn.category = imageItem.category;
                                imageReturn.status = imageItem.status;
                                imageReturn.description = imageItem.description;
                                imageReturn.comment = imageItem.comments;
                                imageReturn.location = imageItem.location;
                                imageReturn.storage = imageItem.storage;

                                let strPath = '/images/' + angularFire.auth.getAuth().uid + '/' + imageItem.$key;
                                imageReturn.imageFile = Observable.fromPromise(storage().ref().child(strPath).getDownloadURL()
                                    .catch(
                                        (error) =>
                                        {
                                            console.log('image does not exist');
                                        }
                                    )
                                );
                                return imageReturn;
                            }
                        );
                    }

                }
            );

    }
}