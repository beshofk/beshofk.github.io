import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, DocumentReference, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<any>;
  currentUser=new BehaviorSubject(null);

  constructor(private afAuth: AngularFireAuth, private firestore: Firestore, private router:Router) { 
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // return this.db.doc(`users/${user.uid}`).valueChanges().pipe(
          //   take(1),
          //   tap(data => {
          //     data['id'] = user.uid;
          //     this.currentUser.next(data);
          //   })
          // );
        } else {
          this.currentUser.next(null);
          return of(null);
        }
      })
    );
  }


  async signUp(credentials): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(data => {
      const docRef: DocumentReference = doc(this.firestore, `users/${data.user.uid}`);
      const userData = {
        first_name: credentials.first_name,
        last_name: credentials.last_name,
        email: data.user.email,
        role: 'USER',
        permissions: [],
        created: new Date(), // firebase.firestore.FieldValue.serverTimestamp()
      };
      return setDoc(docRef, userData);
    });
  }

  // signIn(credentials): Observable<any> {
  //   return from(this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password)).pipe(
  //     switchMap(user => {
  //       if (user) {
  //         return this.db.doc(`users/${user.user.uid}`).valueChanges().pipe(
  //           take(1),
  //           tap(data => {
  //             this.currentUser.next(data);
  //             localStorage.removeItem('currentUser');
  //             localStorage.setItem('currentUser', data['role']);
  //           })
  //         );
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   );
  // }

  signIn(credentials: {email: string, password: string}): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password).then(data => {
      if (data) {
        this.currentUser.next(data);
        localStorage.removeItem('currentUser');
        localStorage.setItem('currentUser', data['role']);
      }
    }));
  }

  signOut() {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('/login');
  }

  isLoggedIn() {
    console.log(localStorage.getItem('currentUser'));
    if (localStorage.getItem('currentUser') === 'ADMIN' || localStorage.getItem('currentUser') === 'VIEWER') {
      console.log(localStorage.getItem('currentUser'));
      return true;
    }
    return false;
  }
}
