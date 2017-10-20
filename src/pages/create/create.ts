import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';

import { Blog } from '../../models/blog';
import { AuthProvider } from '../../providers/auth/auth';
import { BlogsProvider } from '../../providers/blogs/blogs';

@IonicPage({
  name: 'create'
})
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {
  createBlogForm: FormGroup;
  title: AbstractControl;
  summary: AbstractControl;
  description: AbstractControl;
  error:any;
  blog = {} as Blog;
  loading:Loading;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private loadingCtrl:LoadingController, 
    private alertCtrl: AlertController,  
    private formBuilder: FormBuilder, 
    private blogsProvider:BlogsProvider, 
    private afAuth:AuthProvider) {
      this.createBlogForm = this.formBuilder.group({
        'title': ['', Validators.compose([Validators.required])],
        'summary': ['', Validators.compose([Validators.required])],
        'description': ['', Validators.compose([Validators.required])]        
      });
      this.title = this.createBlogForm.controls['title'];
      this.summary = this.createBlogForm.controls['summary'];
      this.description = this.createBlogForm.controls['description'];  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');
  }
  creatBlog(){
    //console.log('Blog Form');
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...please wait',
      dismissOnPageChange:true,
    });
    if(this.createBlogForm.valid){
      const userId = this.afAuth.currentUser;
      this.blog = {title:this.title.value, summary:this.summary.value, content:this.description.value, userId:userId, comments:{}};
      this.blogsProvider.addNewBlog(this.blog).subscribe(data => {
        let alert = this.alertCtrl.create({
          message: 'Blog Created successfully',
          buttons: [{
            text: 'Ok',
            role: 'cancel'
          }]
        });
        alert.present();
        this.navCtrl.pop();
      }, blogError => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            message: 'Error in creating the blog',
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          });
          alert.present();
        });
        this.error = blogError;
      });
      this.loading.present();
    }
  }
}
