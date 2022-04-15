import { ExcelService } from './../../services/excel.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { ModalController, Platform } from '@ionic/angular';
// import { Papa } from 'ngx-papaparse';
import { RoomPage } from '../room/room.page';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-rooms',
  templateUrl: './admin-rooms.page.html',
  styleUrls: ['./admin-rooms.page.scss'],
})
export class AdminRoomsPage implements OnInit {
  role = localStorage.getItem('currentUser');
  remainFilter = new FormControl();
  filteredValues = { remaining: '' };
  allData = [];
  dataSource = new MatTableDataSource<ReturnedData>(this.allData);
  displayedColumns;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  excelExportedData = [];
  printedRooms: any[] = [];
  constructor(private room: RoomService, private modalCtrl: ModalController, // private papa: Papa,
              private plt: Platform, private excelService: ExcelService) {
      if (this.role === 'ADMIN') {
        this.displayedColumns =  ['building', 'roomFloor', 'roomName' , 'roomType', 'remaining', 'action'];
      }
      if (this.role === 'VIEWER') {
        this.displayedColumns =  ['building', 'roomFloor', 'roomName' , 'roomType', 'remaining'];

      }
      this.loadCSV();
    }


  ngOnInit() {
    this.remainFilter.valueChanges.subscribe((remainFilterValue) => {
      this.filteredValues['remaining'] = remainFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  private loadCSV() {
    this.room.getAdminRooms().subscribe( res => {
      this.dataSource.data = [];
      this.printedRooms = res;
      res.forEach((value, index) => {
        const obj: ReturnedData = {
          id: '',
          remaining: 0,
          roomFloor: '',
          roomName: '',
          roomType: '',
          building: ''
        };
        obj.id = value['id'];
        obj.remaining = value['data']['remaining'];
        obj.roomFloor = value['data']['roomFloor'];
        obj.roomName = value['data']['roomName'];
        obj.roomType = value['data']['roomType'];
        obj.building = value['data']['building'];
        console.log(value);
        this.allData.push(obj);
        this.dataSource.data = this.allData;
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;

      });
    });
   // console.log(this.dataSource.data);
  }
  exportCSV() {
    this.dataSource.filteredData.forEach((value, index) => {
      const obj: ExcelData = {
        اسم_الغرفة: '',
        الباقي: 0,
        المبني: '',
        رقم_دور_الغرفة: '',
        نوع_الغرفة: '',
      };
      obj.الباقي = value.remaining;
      obj.رقم_دور_الغرفة = value.roomFloor;
      obj.اسم_الغرفة = value.roomName;
      obj.نوع_الغرفة = value.roomType;
      obj.المبني = value.building;
      this.excelExportedData.push(obj);
  });
    this.excelService.exportAsExcelFile(this.excelExportedData, 'الغرف');
  }
  customFilterPredicate() {
    const myFilterPredicate = function(data: ReturnedData, filter: string): boolean {
      const searchString = JSON.parse(filter);
      const remainFound = data.remaining.toString().trim().toLowerCase().indexOf(searchString.remaining) !== -1;
      if (searchString.topFilter) {
        return remainFound;
      } else {
        return remainFound;
      }
    };
    return myFilterPredicate;
  }

  async openRoomModal(id= null) {
    const modal = await this.modalCtrl.create({
      component: RoomPage,
      componentProps: {
        id
      },
      cssClass: 'my-custom-modal-css-room'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.loadCSV();
    }
  }

  addBulkRooms()
  {
    this.room.addBulrooms();
  }

}

export interface ReturnedData {
  id: string;
  remaining: number;
  roomFloor: string;
  roomName: string;
  roomType: string;
  building: string;
}

export interface ExcelData {
  المبني: string;
  رقم_دور_الغرفة: string;
  اسم_الغرفة: string;
  نوع_الغرفة: string;
  الباقي: number;
}

