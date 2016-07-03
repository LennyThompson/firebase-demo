import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {HomePage} from '../home-page/home-page';
import {AboutPage} from '../about-page/about-page';
import {ContactPage} from '../contact-page/contact-page';
import {AngularFire, FirebaseObjectObservable } from "angularfire2/angularfire2";
import database = firebase.database;

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  
  public user: FirebaseObjectObservable<any>;

  constructor(private navParams: NavParams, angularFire: AngularFire) {
    // this tells the tabs component which Pages
    // should be each tab's root Page

    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
    let strPath: string = '/users/' + angularFire.auth.getAuth().uid;
    this.user = angularFire.database.object(strPath);
    if(navParams.get('newUser'))
    {
      this.user = angularFire.database.object(strPath);
      let userCreate = {
        name: navParams.get('email'),
        surname: '',
        email: navParams.get('email'),
        created: (<any>database).ServerValue.TIMESTAMP,
        updated: (<any>database).ServerValue.TIMESTAMP
      };
      this.user.set(userCreate);
    }
    else
    {
      this.user = angularFire.database.object(strPath);
    }
  }
}
