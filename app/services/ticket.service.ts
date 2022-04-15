import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { addDoc, doc, updateDoc, collection, Firestore, collectionData, docData, deleteDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private firestore: Firestore) { }

  createOrUpdateTicket(id = null, info: any): Promise<any> {
    if (id) {
      const docRef = doc(this.firestore, `tickets/${id}`);
      return updateDoc(docRef, info);
    } else {
      const collectoionRef = collection(this.firestore, 'tickets');
      return addDoc(collectoionRef, info);
    }
  }

  getAdminTickets(): Observable<any[]> {
    const collectoionRef = collection(this.firestore, 'tickets');
    return collectionData(collectoionRef, { idField: 'id' }) as Observable<any[]>;
    // .snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data();
    //     const id = a.payload.doc.id;
    //     return { id, data };
    //   }))
    // );
  }

  // TODO => Make one method getById() take coolection and id
  getTicket(id: string): Observable<any> {
    const docRef = doc(this.firestore, `tickets/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(map(take(1))) as Observable<any>;
  }

  getUser(id: string): Observable<any> {
    const docRef = doc(this.firestore, `users/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(map(take(1))) as Observable<any>;
  }

  deleteTicket(id: string): Promise<void> {
    const docRef = doc(this.firestore, `tickets/${id}`);
    return deleteDoc(docRef);
  }
}
