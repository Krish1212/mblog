import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';


import { HomePage } from '../home/home';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  error: any;
  user = {} as User;
  loading: Loading;
  profileData:any;
  registered:boolean;
  alertMessage:String;
  
  
  constructor(public navCtrl: NavController, 
    private navParams: NavParams,
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, 
    private formBuilder: FormBuilder, 
    private afAuth: AuthProvider, 
    private afDatabase:AngularFireDatabase) {
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.compose([Validators.required,EmailValidator.isValid])],
      'password': ['',Validators.compose([Validators.minLength(6),Validators.required])]
    });
    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
    this.registered = this.navParams.get('registered') ? this.navParams.get('registered') : false;
    this.alertMessage = this.navParams.get('message') ? this.navParams.get('message') : null;
  }
  ionViewDidLoad(){
    if(this.registered){
      let pageload = this.alertCtrl.create({
        message: this.alertMessage.toString(),
        buttons:[{
          text:'Ok',
          role:'cancel'
        }]
      });
      pageload.present();
    }
  }

  login() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...please wait',
      dismissOnPageChange:true,
    });
    if(this.loginForm.valid){
      this.user = ({username: this.username.value, password: this.password.value});
      this.afAuth.loginUser(this.user).subscribe(authData => {
        this.profileData = this.afDatabase.database.ref(`profile/${authData.uid}`);
        //console.log(this.profileData);
        this.profileData.on('value', profileSnapShot => {
          //console.log(profileSnapShot.val());
          if(profileSnapShot.val() === null) {
            this.navCtrl.push('profile');
          } else {
            this.navCtrl.setRoot(HomePage, {profile: profileSnapShot.val()});
          }
        });
      }, authError => {
        //console.log(authError);
        this.loading.dismiss().then(() => {
          if(authError.code === 'auth/user-not-found'){
            let alert = this.alertCtrl.create({
              message: 'User Not Found...Kindly register',
              buttons: [{
                text: 'Ok',
                role: 'cancel'
              }]
            });
            alert.present();
          }
        });
        this.error = authError;
      });
      this.loading.present();
    }
  }
  fbLogin(){
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...please wait',
      dismissOnPageChange:true,
    });
    this.afAuth.loginUsingFb().then(auth => {
      console.log(auth);
    }, authError => {
      console.log(authError);
      this.error = authError;
    })
  }
  register() {
    this.navCtrl.push('register');
  }
  resetPassword() {
    this.navCtrl.push('reset');
  }
}