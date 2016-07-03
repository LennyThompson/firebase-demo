import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {Image} from '../../services/image/image';
import {AngularFire} from "angularfire2/angularfire2";
import {Observable} from "rxjs/Rx";

@Component({
    templateUrl: 'build/pages/scientific-facts-page/scientific-facts-page.html'
})
export class ScientificFactsPage
{
    public CATEGORY_TYPES: any[] = [ {name: 'family', display: 'Family'}, {name: 'friends', display: 'Friends'}, {name: 'work', display: 'Work'}, {name: 'other', display: 'Other'}];
    public STATUS: any[] = [{name: 'storage', display: 'Family'}, {name: 'local', display: 'Local'}, {name: 'deleted', display: 'Deleted'}];
    private image:Image;
    private loadedImage: any;

    constructor(private navController:NavController, private angularFire:AngularFire)
    {
        this.image = new Image();
    }

    saveImage() : void
    {
        let hourGlass = Loading.create({
            content: 'Saving image...'
        });
        this.navController.present(hourGlass);
        this.image.saveToDatabase(this.angularFire)
            .then(
                () =>
                {
                    hourGlass.dismiss();
                    this.navController.pop();
                }
            )
            .catch(
                () =>
                {
                    hourGlass.dismiss();
                    this.navController.pop();
                }
            );
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
            let backColor = this.isImageFileDataTransfer(event.dataTransfer) ? 'gray' : 'pink'
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
        return dataTransfer.items 
            &&
            dataTransfer.items.length
            &&
            dataTransfer.items[0].kind === 'file'
            &&
            dataTransfer.items[0].type.match('^image/');
    }
}
