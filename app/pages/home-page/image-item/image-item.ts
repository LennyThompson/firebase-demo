import {Component} from '@angular/core';
import { AngularFire } from 'angularfire2';
import {Image} from "../../../services/image/Image";

@Component({
    selector: 'image-item',
    inputs: ['imageItem'],
    templateUrl: 'build/pages/home-page/image-item/image-item.html'
})
export class ImageItem {
    public imageItem: Image;
    constructor(private angularFire: AngularFire) {
    }

}
