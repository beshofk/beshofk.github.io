import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { addDoc, doc, updateDoc, collection, Firestore, collectionData, docData, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private firestore: Firestore) { }

  createOrUpdateRoom(id = null, info: any): Promise<any>{
    if(id){
      const docRef = doc(this.firestore, `rooms/${id}`);
      return updateDoc(docRef, info);
    } else {
      const collectoionRef = collection(this.firestore, 'rooms');
      return addDoc(collectoionRef, info);
    }
  }

  getAdminRooms(): Observable<any[]> {
    const collectoionRef = collection(this.firestore, 'rooms');
    return collectionData(collectoionRef, { idField: 'id' }) as Observable<any[]>;
    // return this.db.collection('rooms').snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
        
    //     const data = a.payload.doc.data();
        
    //     const id = a.payload.doc.id;
    //     return { id, data };
    //   }))
    // );
  }

  getAvilableAdminRooms(): Observable<any[]> {
    const collectoionRef = collection(this.firestore, 'rooms');
    return collectionData(collectoionRef, { idField: 'id' }) as Observable<any[]>;
      // return this.db.collection('rooms',ref=>(ref.where("remaining",'>=',1)
      // .where("remaining",'<=',5)
    //   return this.db.collection('rooms').snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data();
    //     const id = a.payload.doc.id;
    //     return { id, data };
    //   }))
    // );
  }

  getRoom(id: string): Observable<any> {
    const docRef = doc(this.firestore, `rooms/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(map(take(1))) as Observable<any>;
  }

  deleteRoom(id: string): Promise<void> {
    const docRef = doc(this.firestore, `rooms/${id}`);
    return deleteDoc(docRef);
  }

 addBulrooms()
 {
  var obj: roomVm;

  
  for (let i = 11; i < 25; i++) {
     obj= 
    { 
      roomName: "R-"+i+" (3+1)",
      building: "1",
      roomType:"4",
      roomFloor:"1",
      remaining:4
  };
    this.createOrUpdateRoom(null,obj);
  }

/*************************************** */
    for (let i = 25; i < 39; i++) {
      obj= 
    { 
      roomName: "R-"+i+" (3+1)",
      building: "1",
      roomType:"4",
      roomFloor:"2",
      remaining:4
    };
    this.createOrUpdateRoom(null,obj);
    }

/********************************** */
    for (let i = 39; i < 54; i++) {
      obj= 
    { 
      roomName: "R-"+i+" (2+1)",
      building: "1",
      roomType:"3",
      roomFloor:"3",
      remaining:3
    };
    this.createOrUpdateRoom(null,obj);
    }

    /***************************************** */
    for (let i = 53; i < 67; i++) {
      obj= 
    { 
      roomName: "R-"+i+" (2)",
      building: "1",
      roomType:"2",
      roomFloor:"4",
      remaining:2
    };
    this.createOrUpdateRoom(null,obj);
    }

/*********************************************** */
      for (let i = 67; i < 81; i++) {
        obj= 
      { 
        roomName: "R-"+i+" (3+1)",
        building: "2",
        roomType:"4",
        roomFloor:"1",
        remaining:4
      };
      this.createOrUpdateRoom(null,obj);
      }

/******************************************* */
      for (let i = 81; i < 93; i++) {
        obj= 
      { 
        roomName: "R-"+i+" (3+1)",
        building: "2",
        roomType:"4",
        roomFloor:"2",
        remaining:4
      };
      this.createOrUpdateRoom(null,obj);
      }
      /****************************************** */
      for (let i = 93; i < 94; i++) {
        obj= 
      { 
        roomName: "R-"+i+" (4)",
        building: "2",
        roomType:"4",
        roomFloor:"2",
        remaining:4
      };
      this.createOrUpdateRoom(null,obj);
      }

      /******************************************** */
      for (let i = 94; i < 95; i++) {
        obj= 
      { 
        roomName: "R-"+i+" (3+1)",
        building: "2",
        roomType:"4",
        roomFloor:"2",
        remaining:4
      };
      this.createOrUpdateRoom(null,obj);
      }
      /******************************************** */
      for (let i = 95; i < 107; i++) {
        obj= 
      { 
        roomName: "R-"+i+" (2+1)",
        building: "2",
        roomType:"3",
        roomFloor:"3",
        remaining:3
      };
      this.createOrUpdateRoom(null,obj);
      }
      /******************************************** */
      for (let i = 95; i < 107; i++) {
        obj= 
      { 
        roomName: "R-"+i+" (2+1)",
        building: "2",
        roomType:"3",
        roomFloor:"3",
        remaining:3
      };
      this.createOrUpdateRoom(null,obj);
      }

 }


}
