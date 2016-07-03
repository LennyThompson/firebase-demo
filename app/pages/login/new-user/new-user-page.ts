import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TabsPage} from './../../tabs/tabs';
import {User} from './../../../services/user/user';
import {FirebaseAuth, FirebaseAuthState} from 'angularfire2';

@Component({
    templateUrl: 'build/pages/login/new-user/new-user-page.html'
})
export class NewUserPage {
    user: User = new User('', '');
    constructor(private navController: NavController, private fireAuth: FirebaseAuth) {
    }

    onClickNewUser() : void
    {
        console.log('login: user ', this.user.name, ', password ', this.user.password);
        this.fireAuth.createUser({email: this.user.name, password: this.user.password})
            .then(
            (status: FirebaseAuthState)=>
            {
                this.navController.push(TabsPage, { email: this.user.name, newUser: true });
            }
        );
    }
}
