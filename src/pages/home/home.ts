import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { CreatePage } from '../create/create';
import { ReaderPage } from '../reader/reader';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [ CreatePage, ReaderPage ]
})
export class HomePage {
  authenticated:any;
  profileData:any;
  loading: Loading;
  blogsList:any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public afAuth: AuthProvider, 
    private afDatabase: AngularFireDatabase, 
    private loadingCtrl: LoadingController) {
    this.profileData = this.navParams.get('profile');
    this.authenticated = this.afAuth.currentUser;
  }
  ionViewWillEnter(){
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading Blogs from database...',
      dismissOnPageChange:true,
    });
    const dbref = this.afDatabase.database.ref();
    this.blogsList = [];
    dbref.child(`blogs/`).on('value', blogSnapShot => {
      //console.log(blogSnapShot.key);
      let blogs:any = JSON.parse(JSON.stringify(blogSnapShot.val()));
      for (let blog in blogs){
        this.blogsList.push(blogs[blog]);
      }
      (this.blogsList) ? this.loading.dismiss('true') : null;
      //console.log(JSON.stringify(this.blogsList));
    });
    this.loading.present();
  }
  login() {
    this.navCtrl.push('login');
  }
  logout() {
    this.afAuth.logoutUser();
    this.navCtrl.setRoot('login');
  }
  openBlog() {
    this.navCtrl.push( CreatePage );
  }
  expand(thisBlog:object){
    this.navCtrl.push(ReaderPage, { _thisBlog: thisBlog});
  }
}
