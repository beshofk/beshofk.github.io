import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  roomForm: FormGroup;
  roomTypes =  [];
  @Input() id;
  constructor(private fb: FormBuilder, private modalCtrl: ModalController,
              private loadingCtrl: LoadingController, private room: RoomService) { }

  ngOnInit() {
    for (let i = 1; 1 < 11; i++) {
      this.roomTypes.push({ value: i});
    }
    this.roomForm = this.fb.group({
      roomName: ['', Validators.required],
      building: ['', Validators.required],
      roomType: [''],
      roomFloor: [''],
      remaining: 0
    });
    if (this.id) {
      this.room.getRoom(this.id).subscribe(room => {
        this.roomForm.patchValue({
          roomName: room['roomName'],
          building: room['building'],
          roomType: room['roomType'],
          roomFloor: room['roomFloor'],
          remaining: room['remaining']
        });
      });
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async saveOrUpdate() {
    
    let loading = await this.loadingCtrl.create({
      message: 'جار التحميل...'
    });
    await loading.present();
    this.roomForm.controls['remaining'].setValue(+this.roomForm.controls['roomType'].value);
    this.room.createOrUpdateRoom(this.id, this.roomForm.value).then(() => {
      loading.dismiss();
      this.close();
    }, err => {
      loading.dismiss();
    })

  }

  async deleteRoom() {
    this.room.deleteRoom(this.id).then(() => {
      this.modalCtrl.dismiss();
    });
  }




}
