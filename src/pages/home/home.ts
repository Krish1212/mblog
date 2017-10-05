import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  authenticated:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {

  }
  ionViewWillEnter(){
    this.authenticated = (this.navParams.get('authenticated') === 'true') ? true : false;
  }
  login() {
    this.navCtrl.push('login');
  }

}
