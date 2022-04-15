import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { FormControl } from '@angular/forms';
import { ExcelService } from '../../services/excel.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-all-subscribers',
  templateUrl: './all-subscribers.page.html',
  styleUrls: ['./all-subscribers.page.scss'],
})
export class AllSubscribersPage implements OnInit {
  tickets: Observable<any>;
  printedTickets: any[] = [];
  excelExportedData = [];
  showMobileNumber = false;
  ageRange = [
    {name: '4 - 11', value: 1},
    {name: '12 - 17', value: 2},
    {name: '18 - 25', value: 3},
    {name: '26 - 35', value: 4},
    {name: '36 - 45', value: 5},
    {name: '45 +', value: 6},
  ];
  gender = [
    {name: 'ذكر', value: 'male'},
    {name: 'أنثي', value: 'female'}
  ];
  status = [
    { name: 'حجز جديد', value: 'new'},
    { name: 'حجز مؤكد', value: 'confirmed'},
    { name: 'حجز ملغي', value: 'deleted'},
  ];
  duplicated = [
    { name: 'عرض المكررين', value: 'true'},
    { name: 'عرض غير المكرر', value: 'false'}
  ];
  months = [
    { name: 'يناير', value: 1},
    { name: 'فبراير', value: 2},
    { name: 'مارس', value: 3},
    { name: 'أبريل', value: 4},
    { name: 'مايو', value: 5},
    { name: 'يونيو', value: 6},
    { name: 'يوليو', value: 7},
    { name: 'أغسطس', value: 8},
    { name: 'سبتمبر', value: 9},
    { name: 'أكتوبر', value: 10},
    { name: 'نوفمبر', value: 11},
    { name: 'ديسمبر', value: 12}
  ];
  currentYear = new Date().getFullYear();
  filteredValues = { subscriber: '', subscriberGender: '', subscriberTelephone: '',
  ageRange: '', duplicated: '', status: '', birthdate: ''};
  nameFilter = new FormControl();
  mobileFilter = new FormControl();
  genderFilter = new FormControl();
  ageFilter = new FormControl();
  statusFilter = new FormControl();
  birthdateFilter = new FormControl();
  duplicatedFilter = new FormControl();
  allData = [];
  dataSource = new MatTableDataSource<any>(this.allData);
  displayedColumns = ['subscriber', 'mobile' , 'birthdate', 'age' ];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('myData', {static: true}) myData: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  sortBy: any;
  constructor(private ticket: TicketService,
              private excelService: ExcelService) {
                this.loadCSV();
              }

  ngOnInit() {
    this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
        this.filteredValues.subscriber = nameFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);

      });
    this.statusFilter.valueChanges.subscribe((statusFilterValue) => {
        this.filteredValues.status = statusFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });
    this.duplicatedFilter.valueChanges.subscribe((duplicatedFilterValue) => {
        this.filteredValues.duplicated = duplicatedFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

    this.genderFilter.valueChanges.subscribe((genderFilterValue) => {
        this.filteredValues.subscriberGender = genderFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });
    this.mobileFilter.valueChanges.subscribe((mobileFilterValue) => {
      this.filteredValues.subscriberTelephone = mobileFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      });
    this.ageFilter.valueChanges.subscribe((ageFilterValue) => {
          this.filteredValues.ageRange = ageFilterValue;
          this.dataSource.filter = JSON.stringify(this.filteredValues);

      });
    this.birthdateFilter.valueChanges.subscribe((birthdateFilterValue) => {
        this.filteredValues.birthdate = birthdateFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.dataSource.filterPredicate = (data, filter) => {
      const searchString = JSON.parse(filter);
      const genderFound = searchString.subscriberGender ? data.subscriberGender === searchString.subscriberGender : true;
      const statusFound = data.status.toString().trim().toLowerCase().indexOf(searchString.status) !== -1;
      const duplicatedFound = data.duplicated.toString().trim().toLowerCase().indexOf(searchString.duplicated) !== -1;
      const mobileFound = data.subscriberTelephone.toString().trim().toLowerCase().indexOf(searchString.subscriberTelephone) !== -1;
      const nameFound = data.subscriber.toString().trim().toLowerCase().indexOf(searchString.subscriber) !== -1;
      const birthdateFound = searchString.birthdate ? (new Date(data.birthdate).getMonth() + 1) === searchString.birthdate : true;
      const ageRangeFound = searchString.ageRange ? data.ageRange === searchString.ageRange : true;
      if (searchString.topFilter) {
      return nameFound || mobileFound || genderFound || duplicatedFound || statusFound || ageRangeFound || birthdateFound;
    } else {
      return nameFound &&  mobileFound  && genderFound  && duplicatedFound && statusFound && ageRangeFound  && birthdateFound;
    }
  };

  }


  private loadCSV() {
    this.ticket.getAdminTickets().subscribe(tickets => {
      tickets.forEach((value, index) => {
        for (let i = 0; i < value['data']['adults'].length; i++) {
          const obj: ReturnedData = {
            subscriber: '',
            subscriberGender: '',
            subscriberAge: 0,
            subscriberTelephone: '',
            birthdate: new Date(),
            duplicated: false,
            status: '',
            ageRange: 0
         };

          obj.subscriber = value['data']['adults'][i]['subscriber'];
          obj.subscriberTelephone = value['data']['adults'][i]['subscriberTelephone'];
          obj.subscriberGender = value['data']['adults'][i]['subscriberGender'];
          obj.duplicated = value['data']['duplicated'];
          obj.status = value['data']['status'];
          obj.birthdate = new Date(value['data']['adults'][i]['subscriberAge']['seconds'] * 1000);
          obj.subscriberAge = this.currentYear - (new Date(value['data']['adults'][i]['subscriberAge']['seconds'] * 1000).getFullYear());
          if (obj.subscriberAge >= 12 && obj.subscriberAge <= 17) {
            obj.ageRange = 2;
            } else if (obj.subscriberAge >= 18 && obj.subscriberAge <= 25) {
            obj.ageRange = 3;
            } else if (obj.subscriberAge >= 26 && obj.subscriberAge <= 35) {
            obj.ageRange = 4;
            } else if (obj.subscriberAge >= 36 && obj.subscriberAge <= 45) {
            obj.ageRange = 5;
            } else if (obj.subscriberAge > 45 ) {
              obj.ageRange = 6;
            }
          this.allData.push(obj);
        }
        if (value['data']['childrens'] !== '' || value['data']['childrens'] !== null) {
          for (let j = 0; j <value['data']['childrens'].length; j++) {
            const obj: ReturnedData = {
              subscriber: '',
              subscriberGender: '',
              subscriberAge: 0,
              subscriberTelephone: '-',
              birthdate: new Date(),
              duplicated: false,
              status: '',
              ageRange: 0
            };
            obj.subscriber = value['data']['childrens'][j]['child'];
            obj.birthdate = new Date(value['data']['childrens'][j]['childAge']['seconds'] * 1000);
            obj.subscriberAge = this.currentYear - (new Date(value['data']['childrens'][j]['childAge']['seconds'] * 1000).getFullYear());
            obj.subscriberGender = value['data']['childrens'][j]['childGender'];
            obj.duplicated = value['data']['duplicated'];
            obj.status = value['data']['status'];
            if (obj.subscriberAge <= 11 && obj.subscriberAge >= 4) {
              obj.ageRange = 1;
            } else if (obj.subscriberAge >= 12 ) {
              obj.ageRange = 2;
            }
            this.allData.push(obj);
          }
        }
    });
      this.dataSource.data = this.allData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  exportNamesOnlyData() {
    this.dataSource.filteredData.forEach((value, index) => {
      const excelObj = {
        الاسم: ''
      };
      excelObj.الاسم = value['subscriber'];
      this.excelExportedData.push(excelObj);
    });
    this.excelService.exportAsExcelFile(this.excelExportedData, 'المشتركين' );
  }

  exportAllData() {
    this.dataSource.filteredData.forEach((value, index) => {
      const excelObj = {
        الاسم: '',
        الموبايل: '',
        السن: 0,
        تاريخالميلاد: new Date()
      };
      excelObj.الاسم = value['subscriber'];
      excelObj.السن = value['subscriberAge'];
      excelObj.الموبايل = value['subscriberTelephone'];
      excelObj.تاريخالميلاد = value['birthdate'];

      this.excelExportedData.push(excelObj);
    });
    this.excelService.exportAsExcelFile(this.excelExportedData, 'المشتركين' );

  }
  resetFilters() {
    this.nameFilter.reset();
    this.ageFilter.reset();
    this.statusFilter.reset();
    this.duplicatedFilter.reset();
    this.mobileFilter.reset();
    this.genderFilter.reset();
    this.birthdateFilter.reset();
    this.filteredValues = { subscriber: '', subscriberGender: '', subscriberTelephone: '',
    ageRange: '', duplicated: '', status: '', birthdate: ''};
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }


  resetSort() {
    this.sort.sort({id: '', start: 'asc', disableClear: false});
  }
}



export interface ReturnedData {
  subscriber: string;
  ageRange: number;
  birthdate: Date;
  status: string;
  subscriberTelephone: string;
  subscriberGender: string;
  subscriberAge: number;
  duplicated: boolean;
}

export interface ExcelData {
  name: '';
}


