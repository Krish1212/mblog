import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  authenticated:any;
  profileData:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AuthProvider) {
    this.profileData = this.navParams.get('profile');
  }
  ionViewDidLoad(){
    this.authenticated = this.afAuth.currentUser;
  }
  login() {
    this.navCtrl.push('login');
  }
  logout() {
    this.afAuth.logoutUser();
    this.navCtrl.setRoot('login');
  }

}
