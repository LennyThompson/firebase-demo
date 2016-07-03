import {Component} from '@angular/core';
import {NavController, Loading, NavParams} from 'ionic-angular';
import {Image} from '../../services/image/image';
import {AngularFire} from "angularfire2/angularfire2";
import {Observable} from "rxjs/Rx";

@Component({
    templateUrl: 'build/pages/edit-image-page/edit-image-page.html'
})
export class EditImagePage
{
    public CATEGORY_TYPES: any[] = [ {name: 'family', display: 'Family'}, {name: 'friends', display: 'Friends'}, {name: 'work', display: 'Work'}, {name: 'other', display: 'Other'}];
    public STATUS: any[] = [{name: 'storage', display: 'Family'}, {name: 'local', display: 'Local'}, {name: 'deleted', display: 'Deleted'}];
    private image:Image;
    private addNewImage: boolean;
    private loadedImage: any;
    private saveButtonText: string;
    private pageTitle: string;
    private updateFields: string[];

    constructor(private navParams: NavParams, private navController:NavController, private angularFire:AngularFire)
    {
        this.image = navParams.get('image');
        this.addNewImage = navParams.get('newImage');
        this.saveButtonText = this.addNewImage ? 'Save' : 'Update';
        this.pageTitle = this.addNewImage ? 'New Image' : 'Edit Image';
        this.updateFields = [];
    }

    get imageName(): string
    {
        return this.image.name;
    }
    set imageName(strName: string)
    {
        if(this.image.name !== strName)
        {
            this.image.name = strName;
            if(!this.updateFields.find((value) => { return value === 'name'; }))
            {
                this.updateFields.push('name');
            }
        }
    }

    get imageDescription(): string
    {
        return this.image.description;
    }
    set imageDescription(strDescription: string)
    {
        if(this.image.description !== strDescription)
        {
            this.image.description = strDescription;
            if(!this.updateFields.find((value) => { return value === 'description'; }))
            {
                this.updateFields.push('description');
            }
        }
    }

    get imageComment(): string
    {
        return this.image.comments;
    }
    set imageComment(strComment: string)
    {
        if(this.image.comments !== strComment)
        {
            this.image.comments = strComment;
            if(!this.updateFields.find((value) => { return value === 'comments'; }))
            {
                this.updateFields.push('comments');
            }
        }
    }

    get imageLocation(): string
    {
        return this.image.location;
    }
    set imageLocation(strLocation: string)
    {
        if(this.image.location !== strLocation)
        {
            this.image.location = strLocation;
            if(!this.updateFields.find((value) => { return value === 'location'; }))
            {
                this.updateFields.push('location');
            }
        }
    }

    get imageCategory(): string
    {
        return this.image.category;
    }
    set imageCategory(strCategory: string)
    {
        if(this.image.category !== strCategory)
        {
            this.image.category = strCategory;
            if(!this.updateFields.find((value) => { return value === 'category'; }))
            {
                this.updateFields.push('category');
            }
        }
    }

    saveImage() : void
    {
        let hourGlass = Loading.create({
            content: this.addNewImage ? 'Saving image...' : 'Updating image...'
        });
        this.navController.present(hourGlass);
        if(this.addNewImage)
        {
            this.image.saveToDatabase(this.angularFire)
                .then(
                    () => {
                        hourGlass.dismiss();
                        this.navController.pop();
                    }
                )
                .catch(
                    () => {
                        hourGlass.dismiss();
                        this.navController.pop();
                    }
                );
        }
        else
        {
            this.image.updateInDatabase(this.updateFields, this.angularFire)
                .then(
                    () => {
                        hourGlass.dismiss();
                        this.navController.pop();
                    }
                )
                .catch(
                    () => {
                        hourGlass.dismiss();
                        this.navController.pop();
                    }
                );
        }
    }

    cancel() : void
    {
        this.navController.pop();
    }

    onDragStart(event): void
    {
        console.log('onDragStart', event);
    }

    onDragEnter(event): void
    {
        if(event.target.className === 'drop-zone')
        {
            let backColor = this.isImageFileDataTransfer(event.dataTransfer) ? 'gray' : 'pink';
            event.target.style.background = backColor;
        }
        console.log('onDragEnter', event);
    }

    onDragOver(event): void
    {
        event.preventDefault();
    }

    onDrop(event): void
    {
        event.preventDefault();
        if(this.isImageFileDataTransfer(event.dataTransfer))
        {
            this.image.imageFile = 
            {
                file: event.dataTransfer.files[0],
                type: event.dataTransfer.files[0].type
            };
            let readPromise = new Promise<any>(
                (resolve, reject) =>
                {
                    var fileReader = new FileReader();
                    fileReader.onload = function () {

                        resolve(fileReader.result);
                    };
                    fileReader.readAsDataURL(event.dataTransfer.files[0]);

                });
            this.loadedImage = Observable.fromPromise(readPromise);
        }
    }


    isImageFileDataTransfer(dataTransfer: DataTransfer): boolean
    {
        return Boolean(dataTransfer.items 
            &&
            dataTransfer.items.length
            &&
            dataTransfer.items[0].kind === 'file'
            &&
            dataTransfer.items[0].type.match('^image/'));
    }
}
