import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TabsPage} from './../tabs/tabs';
import {NewUserPage} from './new-user/new-user-page';
import {User} from './../../services/user/user';
import {FirebaseAuth} from 'angularfire2';

@Component({
    templateUrl: 'build/pages/login/login-page.html'
})
export class LoginPage {
    user: User = new User('', '');
    constructor(
        private navController: NavController,
        private fireAuth: FirebaseAuth
    )
    {
    }

    onClickLogin() : void
    {
        console.log('login: user ', this.user.name, ', password ', this.user.password);
        this.fireAuth.login({ email: this.user.name, password: this.user.password })
            .then(
                (status)=>
                {
                    this.navController.push(TabsPage, { email: this.user.name, newUser: false });
                }
            );
    }
    onClickNewUser() : void
    {
        this.navController.push(NewUserPage);
    }
}
