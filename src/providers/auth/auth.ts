import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase/app';

import { User } from '../../models/user';
import { Profile } from '../../models/profile';

@Injectable()
export class AuthProvider {

  user = {} as User;
  profile = {} as Profile;
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, private facebook:Facebook) {
    //console.log('Hello AuthProvider Provider');
  }

  loginUser(user: User) {
    return Observable.create(observer => {
      this.afAuth.auth.signInWithEmailAndPassword(user.username, user.password).then((authData) => {
        observer.next(authData)
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  signupUser(user: User) {
    return Observable.create(observer => {
      this.afAuth.auth.createUserWithEmailAndPassword(user.username, user.password).then(authData => {
        observer.next(authData);
      }).catch(error => {
        observer.error(error);
      });
    });
  }
  logoutUser() {
    return this.afAuth.auth.signOut();
  }
  get currentUser():string{
    return this.afAuth.auth.currentUser ? this.afAuth.auth.currentUser.uid : null;
  }
  createProfile(profile: Profile) {
    //console.log(profile);
    return Observable.create(observer => {
      this.afAuth.authState.take(1).subscribe(auth => {
        this.afDatabase.object(`profile/${auth.uid}`).set(profile)
        .then((data) => {
          observer.next(auth);
        }).catch(error => {
          observer.error(error);
        });
      });
    });
  }
  resetPassword(emailAddress: string){
    return Observable.create(observer => {
      this.afAuth.auth.sendPasswordResetEmail(emailAddress).then((success) => {
        observer.next(success);
      }, error => {
        observer.next(error);
      });
    });
  }
  loginUsingFb(){
    return Observable.create(observer => {
      this.facebook.login(["email"]).then((loginResponse) => {
        const credentials = firebase.auth.FacebookAuthProvider.credential(loginResponse.authResponse.accessToken);
        this.afAuth.auth.signInWithCredential(credentials).then((result) => {
          observer.next(result);
        }, error => {
          observer.next(error);
        });
      });
    });
  }
}
