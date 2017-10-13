import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

//import { HomePage } from '../home/home';
import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

@IonicPage({
  name: 'register'
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  error:any;
  user = {} as User;
  loading: Loading;
  constructor(public navCtrl: NavController, 
    public navParams:NavParams, 
    private formBuilder:FormBuilder, 
    private afAuth: AuthProvider, 
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController) {
    this.registerForm = this.formBuilder.group({
      'username': ['', Validators.compose([Validators.required,EmailValidator.isValid])],
      'password':['',Validators.compose([Validators.minLength(6),Validators.required])]
    });
    this.username = this.registerForm.controls['username'];
    this.password = this.registerForm.controls['password'];
  }
  register() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...please wait',
        dismissOnPageChange:true
    });
    if(this.registerForm.valid){
      this.user = ({'username':this.username.value, 'password':this.password.value});
      this.afAuth.signupUser(this.user).subscribe(authData => {
        //console.log(authData);
        this.navCtrl.push('login',{registered:true, message:"Register successfully...Please Login to have fun"});
      }, authError => {
        this.loading.dismiss().then(() => {
          //console.log(authError);
          let errorMessage: string = authError.message;
          if (authError.code === 'auth/weak-password' || authError.code === 'auth/email-already-in-use'){
            let errorAlert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [{
                text: 'Ok',
                role: 'cancel'
              }]
            });
            errorAlert.present();
          }
        });
        this.error = authError;
      });
      this.loading.present();
    }
  }
}
