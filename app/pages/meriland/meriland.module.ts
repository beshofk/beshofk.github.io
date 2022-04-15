import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MerilandPage } from './meriland.page';
import { MaterialModule } from '../../material.module';
import {MatSortModule} from '@angular/material/sort';
const routes: Routes = [
  {
    path: '',
    component: MerilandPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MatSortModule
  ],
  declarations: [MerilandPage]
})
export class MerilandPageModule {}
