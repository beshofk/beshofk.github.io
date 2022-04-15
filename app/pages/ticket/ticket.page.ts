import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { TicketService } from 'src/app/services/ticket.service';
import { RoomService } from 'src/app/services/room.service';
// import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import {priceListVm } from 'src/app/viewModel/priceListVm';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss']
})



export class TicketPage implements OnInit {

  selectedDate: any;
  myDatePickerOptions: any;
  ticketForm: FormGroup;
  formSubmitted = false;
  avilableRooms: any[] = [];

  adultCost = 350;
  childCost = 225;
  shoubraBus = 75;
  merilandBus = 100;
  foodcost=100;
  bedCost=150;

  totalCoast: number;
  remaining: number;
  isReadonly = false;
  selectDisable = false;
  totalBedsNeeded:string;
  oldBedCountNeeded:number;
  rommCurrentValue:string;
  values = [];
  childernAgeValues = [];
  invalid = [];
  @Input() id;
  isUserAcceptconditions: boolean;
  isUserCreated: boolean;

  readPrice: boolean;



  isAdultTitleVisible: boolean;
  isChildTitleVisible: boolean;
  isvalidationTypeVisible: boolean;
  faCheckCircleString: any;
  minDateChildren: Date;
  maxDateChildren: Date;
  minDateAdult: Date;
  maxDateAdult: Date;
  priceList:priceListVm;
  priceListStringVm = [];
  i = 0;
  timer;
  mobilePattern = '^01[0-2]{1}[0-9]{8}';
  namePattern = '^[\u0621-\u064A ]+$';
  transports = [
    { name: 'القاهرة', value: 'cairo'},
    { name: 'بني سويف', value: 'bensouief'},
    { name: 'المنيا', value: 'menya'},
    { name: 'أخري', value: 'others'},
  ];

  status = [
    { name: 'جديد', value: 'new'},
    { name: 'حجز مؤكد', value: 'confirmed'},
    { name: 'كحجز مكرر', value: 'duplicated'},
    { name: 'حجز محذوف', value: 'deleted'},

  ];

  childBuses = [
    { name: 'اتوبيس ميريلاند 100 جنيه', value: 'meriland'},
    { name: 'اتوبيس شبرا 75 جنية', value: 'shoubra'},
    { name: 'سيارة خاصة', value: 'private'},
    { name: 'بدون كرسى', value: 'withoutchair'},
  ];

  buses = [
    { name: 'اتوبيس ميريلاند 100 جنيه', value: 'meriland'},
    { name: 'اتوبيس شبرا 75 جنية', value: 'shoubra'},
    { name: 'سيارة خاصة', value: 'private'}
  ];

  constructor(private fb: FormBuilder, private modalCtrl: ModalController,
              private loadingCtrl: LoadingController, private ticket: TicketService,
              private room: RoomService) {
                const currentYear = new Date().getFullYear();
                this.minDateAdult = new Date(currentYear - 90, new Date().getMonth(), new Date().getUTCDate());
                this.maxDateAdult = new Date(currentYear - 12, new Date().getMonth(), new Date().getUTCDate());
                this.minDateChildren = new Date(currentYear - 12, new Date().getMonth(), new Date().getUTCDate());
                this.maxDateChildren = new Date(currentYear - 3, new Date().getMonth(), new Date().getUTCDate());
              }

  ngOnInit() {
  // this.faCheckCircleString = faCheckCircle;
  this.priceList=new priceListVm();

  this.myDatePickerOptions = {
      dateFormat: 'dd-mm-yyyy'
    };
  for (let i = 0; i < 6; i++) {
      this.values.push({value: i, label: i});
    }
  for (let c = 4; c < 13; c++) {
      this.childernAgeValues.push({value: c, label: c});
    }

  this.isUserAcceptconditions = false;
  this.isUserCreated = false;
  this.isAdultTitleVisible = false;
  this.isChildTitleVisible = false;
  this.isvalidationTypeVisible = false;
  this.totalCoast = 0;
  this.ticketForm = this.fb.group({
         reservationType: [''],
         subscriber: ['', Validators.required]
    });
    // this.remaining="50";
  this.intializeForm();
  }
  acceptTerms() {this.isUserAcceptconditions = true; }

  intializeForm() {
    this.getRooms();
    this.ticketForm = this.fb.group({
      reservationType: this.ticketForm.controls.reservationType.value,
      adultNumber: 0,
      adults: new FormArray([]),
      childNumber: 0,
      childrens: new FormArray([]),
      status: 'new',
      duplicated: false,
      roomId: [''],
      subscriptionNotes: [''],
      totalCoast: 0,
      paidCoast: 0,
      remainigCoast: 0
    });
    this.readPrice = false;
    this.rommCurrentValue="";
    this.oldBedCountNeeded=0;
    if (this.id) {
      this.i++;
      this.isUserAcceptconditions = true;
      this.ticket.getTicket(this.id).subscribe(ticket => {
        console.log(ticket);
        this.ticketForm.controls['reservationType'].setValue(ticket['reservationType']);
      //  debugger;
        this.changeReservationType();

        if (this.ticketForm.controls['reservationType'].value === 'group') {
          this.generateAdultForm(ticket['adultNumber']);
          this.generateChildForm(ticket['childNumber']);
        }

        console.log(ticket['adults']);


        this.ticketForm.patchValue({
          reservationType: ticket['reservationType'],
          adultNumber: ticket['adultNumber'],
          status: ticket['status'],
          //duplicated:false,
          adults: ticket['adults'],
          childNumber: ticket['childNumber'],
          childrens: ticket['childrens'],
          roomId: ticket['roomId'],
          subscriptionNotes: ticket['subscriptionNotes'],
          totalCoast: ticket['totalCoast'],
          paidCoast: ticket['paidCoast'],
          remainigCoast: ticket['remainigCoast'],
        });

        this.calculateRemaining();
        var childbedcount=0;
        Object.keys(this.ticketForm.get('childrens').value).forEach(key => {
          if (this.ticketForm.get('childrens').value[key]['childBed'] === true) {
            childbedcount++;
          }
        });
        this.oldBedCountNeeded=this.ticketForm.controls['adultNumber'].value + childbedcount;
        this.totalBedsNeeded="عدد السراير المطلوبة:" + (this.ticketForm.controls['adultNumber'].value + childbedcount);
        this.rommCurrentValue=this.ticketForm.controls['roomId'].value;

        Object.keys(this.ticketForm.get('adults').value).forEach(key => {
          this.ticketForm.controls['adults']['controls'][key].patchValue({subscriberAge:ticket['adults'][key]['subscriberAge'].toDate()})
        });

        Object.keys(this.ticketForm.get('childrens').value).forEach(key => {
          this.ticketForm.controls['childrens']['controls'][key].patchValue({childAge:ticket['childrens'][key]['childAge'].toDate()})
        });

      });
      // this.isReadonly = true;
      this.selectDisable = true;
    }
  }
  calculatePrice() {
    this.priceListStringVm=[];
    this.priceList=new priceListVm();
    this.totalCoast = 0;
    if (this.ticketForm.controls['reservationType'].value === 'group') {
    }

    let totalAdultCoast = this.ticketForm.controls['adultNumber'].value * this.adultCost;

    this.priceList.adultCoast=totalAdultCoast;
    this.priceList.adultNumber=this.ticketForm.controls['adultNumber'].value;
    if(this.priceList.adultNumber>0)
    {
      this.priceListStringVm.push(" اجمالى التكلفة لعدد"+this.priceList.adultNumber + " بالغ "+this.priceList.adultCoast);
    }
    let totalChildCoast = this.ticketForm.controls['childNumber'].value * this.childCost;
    this.priceList.childCoast=totalChildCoast;
    this.priceList.childNumber=this.ticketForm.controls['childNumber'].value;
    if(this.priceList.childNumber>0)
    {
    this.priceListStringVm.push(" اجمالى التكلفة لعدد"+this.priceList.childNumber + " طفل "+this.priceList.childCoast);
    }
    Object.keys(this.ticketForm.get('adults').value).forEach(key => {
     if (this.ticketForm.get('adults').value[key].subscriberTransportation === 'shoubra') {
       this.priceList.adultBusShoubraNumber++;
      //this.totalCoast += this.shoubraBus;
     } else if (this.ticketForm.get('adults').value[key].subscriberTransportation === 'meriland') {
      //this.totalCoast += this.merilandBus;
      this.priceList.adultBusMerilandNumber++;
     }
  });

  Object.keys(this.ticketForm.get('childrens').value).forEach(key => {

    if (this.ticketForm.get('childrens').value[key]['childTransportation']=== 'shoubra') {
      this.priceList.childBusShoubraNumber++;
     //this.totalCoast += this.shoubraBus;
    } else if (this.ticketForm.get('childrens').value[key]['childTransportation'] === 'meriland') {
     //this.totalCoast += this.merilandBus;
     this.priceList.childBusMerilandNumber++;
    }
 });

 Object.keys(this.ticketForm.get('childrens').value).forEach(key => {

  if (this.ticketForm.get('childrens').value[key]['childFood'] === true) {
    this.priceList.childFoodNumber++;
  }

   if (this.ticketForm.get('childrens').value[key]['childBed'] === true) {
   this.priceList.childBedNumber++;
  }
});

if(this.priceList.adultBusShoubraNumber>0)
{
  this.priceList.adultBusShoubraCoast=this.priceList.adultBusShoubraNumber * this.shoubraBus;
  this.priceListStringVm.push(" اجمالى التكلفة لأتوبيس شبرا لعدد"+this.priceList.adultBusShoubraNumber + " بالغ "+this.priceList.adultBusShoubraCoast);
}

if(this.priceList.adultBusMerilandNumber>0)
{
  this.priceList.adultBusMerilandCoast=this.priceList.adultBusMerilandNumber * this.merilandBus;
  this.priceListStringVm.push(" اجمالى التكلفة لأتوبيس الميريلاند لعدد"+this.priceList.adultBusMerilandNumber + " بالغ "+this.priceList.adultBusMerilandCoast);
}

if(this.priceList.childBusShoubraNumber>0)
{
 this.priceList.childBusShoubraCoast=this.priceList.childBusShoubraNumber * this.shoubraBus;
 this.priceListStringVm.push(" اجمالى التكلفة لأتوبيس شبرا لعدد"+this.priceList.childBusShoubraNumber + " طفل "+this.priceList.childBusShoubraCoast);
}

if(this.priceList.childBusMerilandCoast=this.priceList.childBusMerilandNumber)
{
  this.priceList.childBusMerilandCoast=this.priceList.childBusMerilandNumber * this.merilandBus;
  this.priceListStringVm.push(" اجمالى التكلفة لأتوبيس الميريلاند لعدد"+this.priceList.childBusMerilandNumber + " طفل "+this.priceList.childBusMerilandCoast);
}
if(this.priceList.childFoodNumber>0){
 this.priceList.childFoodCoast=this.priceList.childFoodNumber * this.foodcost;
 this.priceListStringVm.push(" اجمالى التكلفة للوجبة لعدد"+this.priceList.childFoodNumber + " طفل "+this.priceList.childFoodCoast);
}
if(this.priceList.childBedNumber>0){
  this.priceList.childbedCoast=this.priceList.childBedNumber * this.bedCost;
  this.priceListStringVm.push(" اجمالى التكلفة للسراسر لعدد"+this.priceList.childBedNumber + " طفل "+this.priceList.childbedCoast);
}

    this.totalCoast = totalAdultCoast + totalChildCoast +  this.priceList.adultBusShoubraCoast +  this.priceList.adultBusMerilandCoast +
    this.priceList.childBusShoubraCoast +  this.priceList.childBusMerilandCoast + this.priceList.childFoodCoast +
    this.priceList.childbedCoast;

    this.priceList.totalCoast=this.totalCoast;
  this.priceListStringVm.push(" اجمالى التكلفة "+ this.priceList.totalCoast);
    this.totalBedsNeeded="عدد السراير المطلوبة" + (this.priceList.adultNumber + this.priceList.childBedNumber);
  }
  changeBedSelection(event){

    //To make sure from edit mode
    if (this.id) {
    //To change the label above the room control
    var childbedcount=0;
    Object.keys(this.ticketForm.get('childrens').value).forEach(key => {
      if (this.ticketForm.get('childrens').value[key]['childBed'] === true) {
        childbedcount++;
      }
    });
    this.totalBedsNeeded="عدد السراير المطلوبة:" + (this.ticketForm.controls['adultNumber'].value + childbedcount);
    //alert(this.rommCurrentValue);
    //To check if you selected room before or there is the first time to make that
    if(this.rommCurrentValue=="")
    {
      this.ticketForm.controls['roomId'].setValue('');
    }else{
      //update rooms
     // this.room.createOrUpdateRoom(this.id, this.roomForm.value)
      //console.log(this.ticketForm.get('roomId').value);

      this.room.getRoom(this.ticketForm.get('roomId').value)
      .subscribe(room=>{
        room['remaining']=room['remaining']+this.oldBedCountNeeded;
        this.room.createOrUpdateRoom(this.ticketForm.get('roomId').value, room);
        this.ticketForm.controls['roomId'].setValue('');
        this.getRooms();
      });

    //  console.log(room);
      // fill drop down againw
      //
    }
  }
}


  acceptPrice(){
    this.formSubmitted = true;

    if(this.validationErrorExists())
    {
      this.readPrice = true;
      this.calculatePrice();
    }

  }
  backToForm(){
    this.readPrice = false;
  }

  changeReservationType() {
   // this.formSubmitted = false;
    if (this.ticketForm.controls.reservationType.value === 'single') {
      if (!this.id) {
        this.intializeForm();
      }

      this.generateAdultForm(1);
      this.isvalidationTypeVisible = true;
      this.ticketForm.controls['adultNumber'].setValue(1);

    } else if (this.ticketForm.controls.reservationType.value === 'group') {
      if (!this.id) {
        this.intializeForm();
      }
      this.isvalidationTypeVisible = true;
    }
  //  this.i = 2;
  }
  changeAdultNumber(event) {
    console.log(event);
    this.isAdultTitleVisible = event > 0;
    this.generateAdultForm(event);
    // this.isAdultTitleVisible = event.detail.value > 0;
    // this.generateAdultForm(event.detail.value);
  }
  changeChildNumber(event) {
    this.isChildTitleVisible = event > 0;
    this.generateChildForm(event);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  generateAdultForm(adultNumber: number) {
    this.clearFormArray(this.ticketForm.get('adults') as FormArray);
    for (let i = 0; i < adultNumber; i++) {
      if (i === 0) {
      (this.ticketForm.get('adults') as FormArray).push(this.addAdultsFormGroup(true));
      } else {
      (this.ticketForm.get('adults') as FormArray).push(this.addAdultsFormGroup(false));
      }
    }
  }

  generateChildForm(childNumber: number) {
    this.clearFormArray(this.ticketForm.get('childrens') as FormArray);
    for (let i = 0; i < childNumber; i++) {
      (this.ticketForm.get('childrens') as FormArray).push(this.addChildsFormGroup());
    }
  }

  addAdultsFormGroup(forFirstTime: boolean): FormGroup {
    return this.fb.group({
      subscriber: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      subscriberGender: ['', Validators.required],
      subscriberAge: ['', Validators.required],
      subscriberTelephone: ['', [Validators.required, Validators.maxLength(11), Validators.pattern(this.mobilePattern)]],
      subscriberAddress: ['', Validators.required],
      subscriberTransportation: ['', Validators.required],
      subscriberSocialStatus: ['', Validators.required],
      mainSubscriber: [forFirstTime]
    });
  }

  addChildsFormGroup(): FormGroup {
    return this.fb.group({
      child: ['', Validators.required],
      childGender: ['', Validators.required],
      childAge: ['', Validators.required],
      childTransportation: ['', Validators.required],
      childFood: ['', Validators.required],
      childBed: ['', Validators.required],
    });
  }

/*For text validation*/
  public findInvalidControls() {
    this.invalid = [];
    const controls = this.ticketForm.controls;
    for (const name in controls) {
      if (name === 'adults' || name === 'childrens') {
        let i = 0;
        if (controls[name]['controls']) {
          if (name === 'adults') {
            for (let control of controls[name]['controls']) {

              if (control.controls['subscriber'].invalid) {
                this.invalid.push('الأسم من البيانات المطلوبة للمشترك رقم' + i);
                if (document.getElementById('subscriber' + i) != null) {
                  document.getElementById('subscriber' + i).innerHTML = 'الأسم من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('subscriber' + i) != null) {
                  document.getElementById('subscriber' + i).innerHTML = '';
                }
              }
              if (control.controls['subscriberGender'].invalid) {
                this.invalid.push('النوع من البيانات المطلوبة للمشترك رقم' + i);

                if (document.getElementById('subscriberGender' + i) != null) {
                  document.getElementById('subscriberGender' + i).innerHTML = 'النوع من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('subscriberGender' + i) != null) {
                  document.getElementById('subscriberGender' + i).innerHTML = '';
                }
              }

              if (control.controls['subscriberAge'].invalid) {
                this.invalid.push('تاريخ الميلاد من البيانات المطلوبة للمشترك رقم' + i);
                if (document.getElementById('subscriberAge' + i) != null) {
                  document.getElementById('subscriberAge' + i).innerHTML = 'تاريخ الميلاد من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('subscriberAge' + i) != null) {
                  document.getElementById('subscriberAge' + i).innerHTML = '';
                }
              }

              if (control.controls['subscriberTelephone'].value === '') {
                this.invalid.push('التليفون من البيانات المطلوبة للمشترك رقم' + i);
                if (document.getElementById('subscriberTelephone' + i) != null) {
                  document.getElementById('subscriberTelephone' + i).innerHTML = 'التليفون من البيانات المطلوبة';
                }
              } else if (control.controls['subscriberTelephone'].invalid && control.controls['subscriberTelephone'].value !== '') {
                this.invalid.push('يجب إدخال رقم الموبايل للمشترك' + i + 'بطريقة صحيحة');
                if (document.getElementById('subscriberTelephone' + i) != null) {
                  document.getElementById('subscriberTelephone' + i).innerHTML = 'يجب إدخال رقم الموبايل بطريقة صحيحة';
                }
              } else {
                if (document.getElementById('subscriberTelephone' + i) != null) {
                  document.getElementById('subscriberTelephone' + i).innerHTML = '';
                }
              }


              if (control.controls['subscriberAddress'].invalid) {
                this.invalid.push('العنوان من البيانات المطلوبة للمشترك رقم' + i);
                if (document.getElementById('subscriberAddress' + i) != null) {
                  document.getElementById('subscriberAddress' + i).innerHTML = 'العنوان من البيانات المطلوبة';
                } else {
                  if (document.getElementById('subscriberAddress' + i) != null) {
                  document.getElementById('subscriberAddress' + i).innerHTML = '';
                }
                }
              }

              if (control.controls['subscriberTransportation'].invalid) {
                this.invalid.push('وسيلة المواصلات من البيانات المطلوبة للمشترك رقم' + i);
                if (document.getElementById('subscriberTransportation' + i) != null) {
                  document.getElementById('subscriberTransportation' + i).innerHTML = 'وسيلة المواصلات من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('subscriberTransportation' + i) != null) {
                  document.getElementById('subscriberTransportation' + i).innerHTML = '';
                }
              }

              if (control.controls['subscriberSocialStatus'].invalid) {
                this.invalid.push('الحالة الأجتماعية من البيانات المطلوبة للمشترك رقم' + i);
                if (document.getElementById('subscriberSocialStatus' + i) != null) {
                  document.getElementById('subscriberSocialStatus' + i).innerHTML = 'الحالة الأجتماعية من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('subscriberSocialStatus' + i) != null) {
                  document.getElementById('subscriberSocialStatus' + i).innerHTML = '';
                }
              }

              i++;
          }
          }
          if (name === 'childrens') {
            i = 0;
            for (let control of controls[name]['controls']) {

              if (control.controls['child'].invalid) {
                this.invalid.push('الأسم من البيانات المطلوبة للطفل رقم' + i);
                if (document.getElementById('child' + i) != null) {
                  document.getElementById('child' + i).innerHTML = 'الأسم من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('child' + i) != null) {
                  document.getElementById('child' + i).innerHTML = '';
                }
              }

              if (control.controls['childGender'].invalid) {
                this.invalid.push('النوع من البيانات المطلوبة للطفل رقم' + i);
                if (document.getElementById('childGender' + i) != null) {
                  document.getElementById('childGender' + i).innerHTML = 'النوع من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('childGender' + i) != null) {
                  document.getElementById('childGender' + i).innerHTML = '';
                }
              }

              if (control.controls['childAge'].invalid) {
                this.invalid.push('تاريخ الميلاد من البيانات المطلوبة للطفل رقم' + i);
                if (document.getElementById('childAge' + i) != null) {
                  document.getElementById('childAge' + i).innerHTML = 'النوع من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('childAge' + i) != null) {
                  document.getElementById('childAge' + i).innerHTML = '';
                }
              }

              if (control.controls['childTransportation'].invalid) {
                this.invalid.push('وسيلة المواصلات  من البيانات المطلوبة للطفل رقم' + i);
                if (document.getElementById('childTransportation' + i) != null) {
                  document.getElementById('childTransportation' + i).innerHTML = 'وسيلة المواصلات  من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('childTransportation' + i) != null) {
                  document.getElementById('childTransportation' + i).innerHTML = '';
                }
              }

              if (control.controls['childFood'].invalid) {
                this.invalid.push('وجبة الطفل  من البيانات المطلوبة للطفل رقم' + i);
                if (document.getElementById('childFood' + i) != null) {
                  document.getElementById('childFood' + i).innerHTML = 'وجبة الطفل  من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('childFood' + i) != null) {
                  document.getElementById('childFood' + i).innerHTML = '';
                }
              }

              if (control.controls['childBed'].invalid) {
                this.invalid.push('العنوان من البيانات المطلوبة للطفل رقم' + i);
                if (document.getElementById('childBed' + i) != null) {
                  document.getElementById('childBed' + i).innerHTML = 'العنوان من البيانات المطلوبة';
                }
              } else {
                if (document.getElementById('childBed' + i) != null) {
                  document.getElementById('childBed' + i).innerHTML = '';
                }
              }
              i++;
          }
          }
        }
    }
  }
}

validationErrorExists() {
  if ((this.formSubmitted) && !this.ticketForm.valid) {
    this.findInvalidControls();
  }
  return ((this.formSubmitted) && this.ticketForm.valid);
}

  close() {
    this.modalCtrl.dismiss();
  }

  async saveOrUpdate() {

    console.log(this.ticketForm.controls['adultNumber'].value);
    console.log(this.ticketForm.controls['adultNumber'].value);
    if (this.ticketForm.invalid || this.ticketForm.controls['adultNumber'].value === 0 ||
        this.ticketForm.controls['adultNumber'].value === 0) {
          this.timer = setTimeout(() => {
            this.formSubmitted = false;
          }, 5000);
          return;
    } else {
    let loading = await this.loadingCtrl.create({
      message: 'جار التحميل...'
    });
    await loading.present();
    if (this.id) {


      var childbedcount=0;
      Object.keys(this.ticketForm.get('childrens').value).forEach(key => {
        if (this.ticketForm.get('childrens').value[key]['childBed'] === true) {
          childbedcount++;
        }
      });


      // Update ticket by admin
      if (this.ticketForm.controls['roomId'].value != '') {
        this.room.getRoom(this.ticketForm.controls['roomId'].value).subscribe(room => {
          room['remaining'] = room['remaining'] - (this.ticketForm.controls['adultNumber'].value + childbedcount);
          this.room.createOrUpdateRoom(this.ticketForm.controls['roomId'].value, room);
        });
      }
      this.ticketForm.controls['paidCoast'].setValue(+this.ticketForm.controls['paidCoast'].value);
      this.ticketForm.controls['remainigCoast'].setValue(this.ticketForm.controls['totalCoast'].value -
      this.ticketForm.controls['paidCoast'].value);
    } else { // Create ticket
      this.calculatePrice();
      this.ticketForm.controls['status'].setValue('new');
      this.ticketForm.controls['totalCoast'].setValue(this.totalCoast);
      this.ticketForm.controls['remainigCoast'].setValue(this.totalCoast);
      this.ticketForm.controls['paidCoast'].setValue(0);
    }

    let duplicated: boolean;
    duplicated = false;
    let firstTime = 0;
    this.ticket.getAdminTickets().subscribe(values => {

     values.forEach((value, index) => {
      if (duplicated) return;
      if (value.data['status'] === 'new' || value.data['status'] === 'confirmed') {
     Object.keys(this.ticketForm.get('adults').value).forEach(key => {
             value.data['adults'].forEach((value, index) => {
               if (value['subscriberTelephone'] == this.ticketForm.get('adults').value[key].subscriberTelephone) {
                 duplicated = true;
               }
             });
         });
        }
       });
     if (firstTime == 0) {
     console.log('result' + duplicated);
     this.ticketForm.controls['duplicated'].setValue(duplicated);
     console.log(this.ticketForm.value);

     /******************/
     this.ticket.createOrUpdateTicket(this.id, this.ticketForm.value).then(() => {
          loading.dismiss();
          this.close();
        }, err => {
          loading.dismiss();
        });
     /******************/

     firstTime++;

      }
     this.isUserCreated = true;

     });
    this.validationErrorExists();
  }


  }
  calculateRemaining() {
    this.remaining = this.ticketForm.controls['totalCoast'].value - this.ticketForm.controls['paidCoast'].value;
  }


  deleteTicket() {
    this.ticket.deleteTicket(this.id).then(() => {
      this.modalCtrl.dismiss();
    });
  }

  private getRooms() {
    this.room.getAvilableAdminRooms().subscribe(rooms => {
        rooms.forEach((value, index) => {

        this.avilableRooms[index] = value;
      });

    });
  }
}
