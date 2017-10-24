import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'reader'
})
@Component({
  selector: 'page-reader',
  templateUrl: 'reader.html',
})
export class ReaderPage {
  expandBlog:Object;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.expandBlog = this.navParams.get('_thisBlog');
  }

  ionViewWillEnter(){
    console.log(this.expandBlog);    
  }
}
