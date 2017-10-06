import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

@IonicPage({
  name:'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login() {
    //this.navCtrl.popToRoot();
    this.navCtrl.push(HomePage, {
      'authenticated' : 'true'
    });
  }
  register() {
    this.navCtrl.push('register')
  }

}
