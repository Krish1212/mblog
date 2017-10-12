import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { HomePage } from '../home/home';
import { Profile } from '../../models/profile';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {} as Profile;
  loading: Loading;
  error: any;
  profileData:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afAuth: AuthProvider, 
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController, 
    private afDatabase:AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  createProfile(){
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Creating Your Profile',
      dismissOnPageChange:true
    });
    this.afAuth.createProfile(this.profile).subscribe(authData => {
      //console.log('profile:' + authData.uid);
      this.profileData = this.afDatabase.object(`profile/${authData.uid}`);
      this.profileData.on('value', profileSnapShot => {
        if(profileSnapShot.val() !== null) {
          this.navCtrl.setRoot(HomePage, {profile: profileSnapShot.val()});
        } else {
          let alert = this.alertCtrl.create({
            message: 'Issue in creating your profile',
            buttons: [{
              text:'Ok',
              role: 'cancel'
            }]
          });
          alert.present();
          this.navCtrl.pop();
        }
      });
    }, dataError => {
      this.loading.dismiss().then(() => {
        if(dataError) {
          console.log('profile error: ' + dataError);
          let alert = this.alertCtrl.create({
            message: dataError,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          });
          alert.present();
        }
      });
      this.error = dataError;
    });
    this.loading.present();
  }

}
