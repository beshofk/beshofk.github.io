import { ModalController, Platform } from '@ionic/angular';
import { TicketService } from './../../services/ticket.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketPage } from '../ticket/ticket.page';
// import { Papa } from 'ngx-papaparse';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ExcelService } from 'src/app/services/excel.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl } from '@angular/forms';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AdminDashboardPage implements OnInit {
  tickets: Observable<any>;
  role = localStorage.getItem('currentUser');

  printedTickets: any[] = [];
  excelExportedData = [];
  showMobileNumber = false;
  rangeAge = [
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
  filteredValues = { subscriber: '', gender: '', subscriberTelephone: '', ageRange: '', duplicated: '', status: ''};
  nameFilter = new FormControl();
  mobileFilter = new FormControl();
  genderFilter = new FormControl();
  ageFilter = new FormControl();
  statusFilter = new FormControl();
  duplicatedFilter = new FormControl();
  allData = [];
  currentYear = new Date().getFullYear();
  dataSource = new MatTableDataSource<any>(this.allData);
  displayedColumns = [ 'mainSubscriber', 'adultNumber', 'childNumber' , 'reservationType',
    'totalCoast', 'paidCoast', 'remainigCoast', 'subscriptionNotes', 'edit' ];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  constructor(private ticket: TicketService, private modalCtrl: ModalController,
              // private papa: Papa,
              private plt: Platform, private excelService: ExcelService,
              private changeDetectorRefs: ChangeDetectorRef, private fb: FormBuilder) {
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
        this.filteredValues.gender = genderFilterValue;
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
    this.dataSource.filterPredicate = (data, filter) => {
      const searchString = JSON.parse(filter);
      const genderFound = data['gender'].toString().trim().toLowerCase().indexOf(searchString.gender) !== -1;
      const statusFound = data.status.toString().trim().toLowerCase().indexOf(searchString.status) !== -1;
      const duplicatedFound = data.duplicated.toString().trim().toLowerCase().indexOf(searchString.duplicated) !== -1;
      const mobileFound = data['mobile'].toString().trim().toLowerCase().indexOf(searchString.subscriberTelephone) !== -1;
      const ageRangeFound = data['allAgeRange'].toString().trim().toLowerCase().indexOf(searchString.ageRange) !== -1;
      const nameFound = data['name'].toString().trim().toLowerCase().indexOf(searchString.subscriber) !== -1;
      if (searchString.topFilter) {
      return nameFound || mobileFound || genderFound  || statusFound || duplicatedFound || ageRangeFound;
    } else {
      return nameFound && mobileFound && genderFound &&  statusFound && duplicatedFound && ageRangeFound;
    }
  };

  }
  async openTicket(id) {
    const modal = await this.modalCtrl.create({
      component: TicketPage,
      componentProps: { id },
      cssClass: 'my-custom-modal-css'
      // cssClass: 'my-custom-modal-css-room'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.loadCSV();
    console.log('in edit 1');
    console.log(data);
    if (data) {
      this.loadCSV();
      console.log('in edit 2');
    }
  }

  private loadCSV() {
    console.log('in loadcsv');
    this.dataSource.data = [];
    this.allData = [];
    this.ticket.getAdminTickets().subscribe(tickets => {
      tickets.forEach(((value, index) => {
      const obj: ReturnedData = {
          id: '',
          adultNumber: 0,
          childNumber: 0,
          duplicated: false,
          paidCoast: 0,
          remainigCoast: 0,
          reservationType: '',
          status: '',
          totalCoast: 0,
          subscriptionNotes: '',
          state: false,
          adults: [],
          children: [],
          name: [],
          mobile: [],
          gender: [],
          allAgeRange: []
      };
      obj.adultNumber = value['data']['adultNumber'];
      obj.childNumber = value['data']['childNumber'];
      obj.state = false;
      obj.subscriptionNotes = value['data']['subscriptionNotes'];
      obj.duplicated = value['data']['duplicated'];
      obj.totalCoast = value['data']['totalCoast'];
      obj.reservationType = value['data']['reservationType'];
      obj.remainigCoast = value['data']['remainigCoast'];
      obj.paidCoast = value['data']['paidCoast'];
      obj.id = value['id'];
      obj.status =  value['data']['status'];

      value['data']['adults'].forEach((item: Adults) => {
        const adult: Adults = {
          mainSubscriber: false,
          subscribeBirthdate: new Date(),
          subscriber: '',
          subscriberAddress: '',
          subscriberAge: 0,
          subscriberGender: '',
          subscriberSocialStatus: '',
          subscriberTelephone: '',
          subscriberTransportation: '',
          ageRange: 0
        };
        adult.subscriberAge = this.currentYear - (new Date(item.subscriberAge['seconds'] * 1000).getFullYear());
        adult.subscribeBirthdate = new Date(item.subscriberAge['seconds'] * 1000);
        adult.subscriberGender =  item.subscriberGender;
        adult.mainSubscriber = item.mainSubscriber;
        adult.subscriber = item.subscriber;
        adult.subscriberAddress = item.subscriberAddress;
        adult.subscriberSocialStatus = item.subscriberSocialStatus;
        adult.subscriberTransportation = item.subscriberTransportation;
        adult.subscriberTelephone = item.subscriberTelephone;
        const a  = adult.subscriberAge;
        if (a >= 12 && a <= 17) {
          adult.ageRange = 2;
        }
        if (a >= 18 && a <= 25) {
          adult.ageRange = 3;
        }
        if (a >= 26 && a <= 35) {
          adult.ageRange = 4;
        }
        if (a >= 36 && a <= 45) {
          adult.ageRange = 5;
        }
        if (a > 45 ) {
          adult.ageRange = 6;
        }
        obj.adults.push(adult);
        obj.name.push(adult.subscriber);
        obj.allAgeRange.push(adult.ageRange);
        obj.mobile.push(adult.subscriberTelephone);
        obj.gender.push(adult.subscriberGender);

      });
      if (value['data']['childrens']) {
            value['data']['childrens'].forEach((ch: Children) => {
              const chi: Children = {
                child: '',
                childAge: 0,
                childBed: false,
                childBirthdate: new Date(),
                childFood: false,
                childGender: '',
                childTransportation: '',
                ageRange: 0
              };
              chi.childBirthdate = new Date(ch.childAge['seconds'] * 1000);
              chi.child = ch.child;
              chi.childFood = ch.childFood;
              chi.childGender = ch.childGender;
              chi.childTransportation = ch.childTransportation;
              chi.childAge =  this.currentYear - (new Date(ch.childAge['seconds'] * 1000).getFullYear());
              chi.childBed = ch.childBed;
              const b  = chi.childAge;
              if (b >= 4 && b <= 11) {
                chi.ageRange = 1;
              }
              if (b >= 12 && b <= 17) {
                chi.ageRange = 2;
              }
              obj.children.push(chi);
              obj.allAgeRange.push(chi.ageRange);
              obj.name.push(chi.child);
              obj.gender.push(chi.childGender);

            });
          }
      this.allData.push(obj);
      }));
      this.dataSource.data = this.allData;
      this.dataSource.paginator = this.paginator;
    });
  }





  onToggle(element: ReturnedData) {
    console.log(element.state);
    element.state = !element.state;
  }


  resetFilters() {
    this.nameFilter.reset();
    this.ageFilter.reset();
    this.statusFilter.reset();
    this.duplicatedFilter.reset();
    this.mobileFilter.reset();
    this.genderFilter.reset();
    this.filteredValues = {subscriber: '', gender: '', subscriberTelephone: '', ageRange: '', duplicated: '', status: ''};
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }
}



export interface ReturnedData {
  id: string;
  name: string[];
  mobile: string[];
  gender: string[];

  allAgeRange: number[];

  adultNumber: number;
  childNumber: number;
  duplicated: boolean;
  paidCoast: number;
  remainigCoast: number;
  reservationType: string;
  status: string;
  totalCoast: number;
  subscriptionNotes: string;
  state: boolean;
  adults: Adults[];
  children: Children[];
}


export interface Adults {
  mainSubscriber: boolean;
  subscriber: string;
  subscriberAddress: string;
  subscriberAge: number;
  subscribeBirthdate: Date;
  subscriberGender: string;
  subscriberSocialStatus: string;
  subscriberTelephone: string;
  subscriberTransportation: string;
  ageRange: number;
}

export interface Children {
  child: string;
  childBirthdate: Date;
  childAge: number;
  childBed: boolean;
  childFood: boolean;
  childGender: string;
  childTransportation: string;
  ageRange: number;
}
