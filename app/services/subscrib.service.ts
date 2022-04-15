import { Injectable } from '@angular/core';

import { collection, Firestore, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubscribService {

  constructor(private firestore: Firestore) { }

  getAllUsers(): Observable<any[]> {
    const collectoionRef = collection(this.firestore, 'users');
    return collectionData(collectoionRef, { idField: 'id' }) as Observable<any[]>;
    // return this.db.collection('users').snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //       const data = a.payload.doc.data();
    //       return { data };

    //   }))
    // );
  }
}
