import {Component} from '@angular/core';
import { AngularFire } from 'angularfire2';
import {Image} from "../../../services/image/Image";
import {NavController} from "ionic-angular/index";
import {EditImagePage} from "../../edit-image-page/edit-image-page";

@Component({
    selector: 'image-item',
    inputs: ['imageItem'],
    templateUrl: 'build/pages/home-page/image-item/image-item.html'
})
export class ImageItem {
    public imageItem: Image;
    constructor(private navController: NavController, private angularFire: AngularFire) {
    }

    onDeleteItem()
    {
        console.log('onDeleteItem');
        this.imageItem.deleteInDatabase(this.angularFire);
    }

    onEditItem()
    {
        console.log('onEditItem');
        this.navController.push(EditImagePage, { image: this.imageItem, newImage: false });
    }

}
