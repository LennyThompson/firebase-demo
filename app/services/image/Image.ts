import {AngularFire} from "angularfire2/angularfire2";
import {UUID} from 'angular2-uuid';
import {Observable} from "rxjs/Rx";
import { database, storage } from "firebase";
import 'rxjs/add/operator/map';

export class Image {

    public name: string;
    public comments: string;
    public description: string;
    public location: string;
    public storage: string;
    public status: string;
    public category: string;
    public imageFile: any;
    public created: number;
    public updated: number;

    public key: string;

    constructor ()
    {
        this.status = 'unknown';
        this.category = 'other';
    }

    saveToDatabase(angularFire: AngularFire): Promise<boolean>
    {
        let strUID: string = UUID.UUID().replace(/-/g, '');
        let strPath: string = '/images/' + angularFire.auth.getAuth().uid + '/active/' + strUID;
        let strStoragePath: string = '/images/' + angularFire.auth.getAuth().uid + '/' + strUID;
        let imageObj = angularFire.database.object(strPath);
        this.status = 'storage';
        this.storage = strPath;
        let imageLoadPromise: Promise<boolean>;
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
        let imageTask = imageRef.child(strStoragePath).put(this.imageFile.file, imageMetadata);
        imageLoadPromise = new Promise<boolean>(
            (resolve, reject) => {
                imageTask.on(storage.TaskEvent.STATE_CHANGED,
                    {
                        next: () => {
                        },
                        error: (error) => {
                            reject(error);
                        },
                        complete: () => {
                            resolve(true);
                        }
                    }
                );
            }
        )
            .then(
                () =>
                {
                    imageObj.set
                    (
                        {
                            name: this.name,
                            description: this.description,
                            comments: this.comments,
                            location: this.location,
                            storage: this.storage,
                            status: this.status,
                            category: this.category,
                            created: (<any>database).ServerValue.TIMESTAMP,
                            updated: (<any>database).ServerValue.TIMESTAMP
                        }
                    );
                    return true;
                }
            );
        
        return imageLoadPromise;
    }
    
    deleteInDatabase(angularFire: AngularFire): Promise<void>
    {
        let strRemovePath: string = '/images/' + angularFire.auth.getAuth().uid + '/active/' + this.key;
        angularFire.database.object(strRemovePath).remove();
        
        let strPath: string = '/images/' + angularFire.auth.getAuth().uid + '/deleted/' + this.key;
        let imageObj = angularFire.database.object(strPath);
        
        return imageObj.set
        (
            {
                name: this.name,
                description: this.description,
                comments: this.comments,
                location: this.location,
                storage: this.storage,
                status: 'deleted',
                category: this.category,
                created: this.created,
                updated: (<any>database).ServerValue.TIMESTAMP
            }
        );
    }

    // Given a list of updated fields update them to the database obejct
    
    updateInDatabase(listFields: string[], angularFire: AngularFire): Promise<any>
    {
        // Set up an obejct to contain the update data
        
        let updateData = {
            updated: (<any>database).ServerValue.TIMESTAMP
        };

        listFields.forEach(
            (propertyName) =>
            {
                updateData[propertyName] = this[propertyName];
            }
        );
        
        // Now update the data
        
        let strPath = '/images/' + angularFire.auth.getAuth().uid + '/active/' + this.key;
        return angularFire.database.object(strPath).update(updateData);
    }

    // Load the image description information and the image itself (from storage)
    
    static loadFromDatabase(angularFire: AngularFire): any
    {
        let strPath = '/images/' + angularFire.auth.getAuth().uid + '/active';
        let listPromises = [];
        
        // Load a list of images from the path as an observable (set)...
        
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
                        // Now map the image list to a list of Image objects
                        
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
                                imageReturn.comments = imageItem.comments;
                                imageReturn.location = imageItem.location;
                                imageReturn.storage = imageItem.storage;
                                
                                // Retain the key so we can rebuild the path to the database object(s)
                                
                                imageReturn.key = imageItem.$key;
                                
                                // Read the image storage object, and return the image (this will be access with async in the UI)

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