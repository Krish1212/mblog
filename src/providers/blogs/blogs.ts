import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { Blog } from '../../models/blog';

@Injectable()
export class BlogsProvider {
  blog = {} as Blog;

  constructor(private afAuth: AngularFireAuth, 
    private afDatabase:AngularFireDatabase) {
  }
  addNewBlog(blog: Blog){
    return Observable.create( observer => {
      this.afAuth.authState.subscribe( user => {
        if (user) {
          this.afDatabase.object(`blogs/${blog.title}`).set(blog)
          .then(blogData => {
            observer.next(blogData);
          }).catch(error => {
            observer.next(error);
          });
        }
      }, error => {
        observer.next(error);
      });
    });
  }
}
