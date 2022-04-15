import { ExcelService } from './../../services/excel.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-meriland',
  templateUrl: './meriland.page.html',
  styleUrls: ['./meriland.page.scss'],
})
export class MerilandPage implements OnInit {
  excelData = [];
  allData = [];
  dataSource = new MatTableDataSource<any>(this.allData);

  displayedColumns: string[] = [ 'subscribier', 'mainSubscribier', 'mobile', 'roomId', 'remain', 'paid', 'total'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private ticketService: TicketService, private excelService: ExcelService) {
    this.getData();
  }

  ngOnInit() {
  }



  exportdata(): void {
    this.dataSource.filteredData.forEach((value, index) => {
      const obj: ExcelData = {
        المشترك: '',
        الموبايل: '',
        الغرفة: '',
        المدفوع: '',
        الباقي: '',
        الإجمالي: '',
        المشترك_الرئيسي: ''
      };
      obj.المشترك = value['subscriber'];
      obj.الموبايل = value['subscriberTelephone'];
      obj.الغرفة = value['roomId'];
      obj.المدفوع = value['paidCoast'];
      obj.الباقي = value['remainigCoast'];
      obj.الإجمالي = value['totalCoast'];
      obj.المشترك_الرئيسي = value['mainSubscriberName'];
      this.excelData.push(obj);
    });
    this.excelService.exportAsExcelFile(this.excelData, 'أتوبيس ميرلاند');
  }

  getData() {
    this.ticketService.getAdminTickets().subscribe(tickets => {
      tickets.forEach(row => {
      row.data['adults'].forEach( (ad: ReturnedData) => {
        const main = row.data['adults'].find(m => m.mainSubscriber === true);
        if (ad.subscriberTransportation === 'meriland') {
          const r: ReturnedData = {
            mainSubscriber: false,
            subscriberTelephone: '',
            paidCoast: '',
            remainigCoast: '',
            roomId: '',
            subscriber: '',
            totalCoast: '',
            subscriberTransportation: '',
            mainSubscriberName: ''
          };
          r.mainSubscriber = ad.mainSubscriber;
          r.subscriberTelephone = ad.subscriberTelephone;
          r.roomId = row.data['roomId'] ? row.data['roomId'] : 'غير مسكن';
          r.totalCoast = ad.mainSubscriber ? row.data['totalCoast'] : '-';
          r.paidCoast = ad.mainSubscriber ?  row.data['paidCoast'] : '-';
          r.remainigCoast = ad.mainSubscriber  ?  row.data['remainigCoast'] : '-';
          r.subscriber = ad.subscriber;
          r.mainSubscriberName = ad.mainSubscriber ? ad.subscriber : main['subscriber'];
          this.allData.push(r);
        }
      });

      if (row.data['childrens']) {
        row.data['childrens'].forEach(ch => {
          const rc: ReturnedData = {
            mainSubscriber: false,
            subscriberTelephone: '-',
            paidCoast: '',
            remainigCoast: '',
            roomId: '',
            subscriber: '',
            totalCoast: '',
            subscriberTransportation: '',
            mainSubscriberName: ''
          };
          if (ch['childTransportation'] === 'meriland') {
            const main = row.data['adults'].find(m => m.mainSubscriber === true);
            rc.mainSubscriber = ch.mainSubscriber;
            rc.subscriberTelephone = '-';
            rc.roomId = row.data['roomId'] ? row.data['roomId'] : 'غير مسكن';
            rc.totalCoast = '-';
            rc.paidCoast = '-';
            rc.remainigCoast =  '-';
            rc.subscriber = ch['child'];
            rc.mainSubscriberName =  ch.mainSubscriber ? ch.subscriber : main['subscriber'];
          }
          if (rc.subscriber) {
            this.allData.push(rc);
          }
        });
      }
      });
      this.dataSource.data = this.allData;
      console.log(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      });
  }

  applyFilter(filterValue: KeyboardEvent) {
    // .target.value
    // filterValue = filterValue.trim();
    // filterValue = filterValue.toLowerCase();
    // this.dataSource.filter = filterValue;
  }
}

export interface ReturnedData {
  subscriber: string;
  mainSubscriber: boolean;
  subscriberTelephone: string;
  roomId: string;
  remainigCoast: string;
  paidCoast: string;
  totalCoast: string;
  subscriberTransportation: string;
  mainSubscriberName: string;
}

export interface ExcelData {
  المشترك: string;
  الموبايل: string;
  الباقي: string;
  المدفوع: string;
  الإجمالي: string;
  الغرفة: string;
  المشترك_الرئيسي: string;
}


//   excelData = [];
//   dataSource = new MatTableDataSource<ReturnedData>(ELEMENT_DATA);
//   displayedColumns: string[] = ['position', 'subscribier', 'mainSubscribier', 'mobile', 'roomId', 'remain', 'paid', 'total'];
//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
//   constructor(private ticketService: TicketService, private excelService: ExcelService) {
//     this.getData();
//   }

//   ngOnInit() {
//   }

//   exportdata(): void {
//     this.dataSource.filteredData.forEach((value, index) => {
//       const obj: excelData = {
//         المشترك: '',
//         الموبايل: '',
//         الغرفة: '',
//         المدفوع: '',
//         الباقي: '',
//         الإجمالي: ''
//       };
//       obj.المشترك = value['subscriber'];
//       obj.الموبايل = value['mobile'];
//       obj.الغرفة = value['roomId'];
//       obj.المدفوع = value['paid'];
//       obj.الباقي = value['remain'];
//       obj.الإجمالي = value['total'];
//       this.excelData.push(obj);
//     });
//     this.excelService.exportAsExcelFile(this.excelData, 'أتوبيس ميرلاند');
//   }

//   getData() {
//     this.ticketService.getAdminTickets().subscribe(tickets => {
//       console.log(tickets);
//       this.dataSource.data = [];
//       ELEMENT_DATA = [];
//       for (const i in tickets) {
//         if (tickets[i]['data']) {
//           const row = tickets[i]['data'];
//           const adults = tickets[i]['data']['adults'];
//           const children = tickets[i]['data']['childrens'];
//           for (const j in adults) {
//           if (adults[j]['subscriberTransportation'] === 'meriland') {
//             const shoubra = {
//               mainSubscriber: false,
//               remain: '',
//               subscriber: '',
//               mobile: '',
//               roomId: '',
//               paid: '',
//               total: ''
//               };
//             if (adults[j]['mainSubscriber'] === true) {
//               shoubra.mainSubscriber = adults[j]['mainSubscriber'];
//               shoubra.remain = row['remainigCoast'];
//               shoubra.paid = row['paidCoast'];
//               shoubra.total = row['totalCoast'];
//             } else {
//               shoubra.remain = '-';
//               shoubra.paid = '-';
//               shoubra.total = '-';
//             }
//             shoubra.subscriber = adults[j]['subscriber'];
//             shoubra.mobile = adults[j]['subscriberTelephone'];
//             shoubra.roomId = row['roomId'];
//             ELEMENT_DATA.push(shoubra);
//             }
//           }
//           if (children !== '' || children !== null ) {
//             for (const c in children) {
//               if (children[c]['childTransportation'] === 'meriland') {
//               const sh = {
//                 mainSubscriber: false,
//                 remain: '-',
//                 subscriber: '',
//                 roomId: '',
//                 mobile: '-',
//                 paid: '-',
//                 total: '-'
//                 };
//               sh.subscriber = children[c]['child'];
//               ELEMENT_DATA.push(sh);
//               }
//           }
//           }
//         }
//       }
//       this.dataSource.data = ELEMENT_DATA;
//       this.dataSource.paginator = this.paginator;
//       });
//   }

//   applyFilter(filterValue: string) {
//     filterValue = filterValue.trim();
//     filterValue = filterValue.toLowerCase();
//     this.dataSource.filter = filterValue;
//   }
// }

// export interface ReturnedData {
//   subscriber: string;
//   mobile: string;
//   mainSubscriber: boolean;
//   roomId: string;
//   remain: string;
//   paid: string;
//   total: string;
// }

// export interface excelData {
//   المشترك: string;
//   الموبايل: string;
//   الباقي: string;
//   المدفوع: string;
//   الإجمالي: string;
//   الغرفة: string;
// }

// let ELEMENT_DATA: ReturnedData[] = [];
