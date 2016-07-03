import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EditImagePage} from '../edit-image-page/edit-image-page';
import {AngularFire, FirebaseListObservable} from "angularfire2/angularfire2";
import {ImageItem} from './image-item/image-item';
import {Image} from './../../services/image/image';

@Component({
  templateUrl: 'build/pages/home-page/home-page.html',
  directives: [ImageItem]
})
export class HomePage
{
  public items: FirebaseListObservable<any>;
  
  constructor(private navController: NavController, private angularFire: AngularFire)
  {
    this.items = Image.loadFromDatabase(this.angularFire);
  }

  addNewImage()
  {
    this.navController.push(EditImagePage, { image: new Image(), newImage: true });
  }
}
