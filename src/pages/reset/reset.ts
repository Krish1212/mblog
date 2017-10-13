import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';


import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
  name: 'reset'
})
@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {
  resetForm: FormGroup;
  emailAddress: AbstractControl;
  loading:Loading;
  error:any;

  constructor(public navCtrl: NavController, 
    private loadingCtrl:LoadingController, 
    private alertCtrl: AlertController, 
    private formBuilder: FormBuilder, 
    private afAuth:AuthProvider) {
      this.resetForm = this.formBuilder.group({
        'username': ['', Validators.compose([Validators.required, EmailValidator.isValid])]
      });
      this.emailAddress = this.resetForm.controls['username'];
  }
  resetPassword(){
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Sending your reset email...Please wait',
      dismissOnPageChange:true,
    });
    if(this.resetForm.valid){
      this.afAuth.resetPassword(this.emailAddress.value).subscribe(registerData => {
        console.log(registerData);
        this.navCtrl.setRoot('login', { registered:true, message: "Password reset link sent to your email address"});
      }, resetError => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            message: resetError,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          });
          alert.present();
        });
        this.error = resetError;
      });
      this.loading.present();
    }
  }

}
