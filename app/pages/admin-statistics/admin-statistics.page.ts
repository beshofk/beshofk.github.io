import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.page.html',
  styleUrls: ['./admin-statistics.page.scss'],
})
export class AdminStatisticsPage implements OnInit {
  bedNumbers = 0;
  boysNumber = 0;
  girlsNummber = 0;
  childNumber = 0;
  adultsNumber = 0;
  totalAdultsMale = 0;
  totalAdultsFemale = 0;
  paid = 0;
  total = 0;
  remain = 0;
  totalChildPrimaryNumber = 0;
  childMalePrimaryNumber = 0;
  childFemalePrimaryNumber = 0;
  totalChildPreparatoryNumber = 0;
  childMalereparatoryNumber = 0;
  childFemalereparatoryNumber = 0;
  shoubraBusPersonsNumber = 0;
  merilandBusPersonsNumber = 0;

  currentYear = new Date().getFullYear();

  constructor(
    // private db: AngularFirestore
    ) {
  this.getDataStatistics();
  }

  ngOnInit() {
  }

  getDataStatistics() {
    // this.db.collection('tickets').valueChanges().subscribe(values => {
    //   values.forEach((value, index) => {
    //       if (value['status'] === 'new' || value['status'] === 'confirmed') {
    //         this.bedNumbers += value['adults'].length;
    //         value['adults'].forEach((val, i) => {
    //         if (val['subscriberTransportation'] === 'shoubra') {
    //           this.shoubraBusPersonsNumber ++;
    //         }
    //         if (val['subscriberTransportation'] === 'meriland') {
    //           this.merilandBusPersonsNumber ++;
    //         }
    //         if ((this.currentYear - (new Date(val['subscriberAge']['seconds'] * 1000).getFullYear())) > 17) {
    //             this.adultsNumber ++;
    //             if (val['subscriberGender'] === 'male') {
    //               this.totalAdultsMale++;
    //             }
    //             if (val['subscriberGender'] === 'female') {
    //               this.totalAdultsFemale++;
    //             }
    //           }
    //         if ((this.currentYear - (new Date(val['subscriberAge']['seconds'] * 1000).getFullYear())) < 17) {
    //             this.totalChildPreparatoryNumber ++;
    //             if (val['subscriberGender'] === 'male') {
    //               this.childMalereparatoryNumber++;
    //             }
    //             if (val['subscriberGender'] === 'female') {
    //               this.childFemalereparatoryNumber++;
    //             }
    //           }
    //         });
    //         this.paid += parseInt(value['paidCoast'], 0);
    //         this.total += parseInt(value['totalCoast'], 0);
    //         value['childrens'].forEach((ch, ind) => {
    //             this.totalChildPrimaryNumber++;
    //             if (ch['childBed']) {
    //                   this.bedNumbers++;
    //             }
    //             if (ch['childGender'] === 'male') {
    //             this.childMalePrimaryNumber++;
    //             }
    //             if (ch['childGender'] === 'female') {
    //               this.childFemalePrimaryNumber++;

    //             }
    //             if (ch['childTransportation'] === 'shoubra') {
    //               this.shoubraBusPersonsNumber ++;
    //             }
    //             if (ch['childTransportation'] === 'meriland') {
    //               this.merilandBusPersonsNumber ++;

    //             }
    //          // }
    //         });
    //       }
    //     });
    //   });
  }


}

