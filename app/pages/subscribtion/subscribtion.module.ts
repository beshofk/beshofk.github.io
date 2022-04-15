import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SubscribtionPage } from './subscribtion.page';
import { MaterialModule } from '../../material.module';
const routes: Routes = [
  {
    path: '',
    component: SubscribtionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MaterialModule
    // MatTableModule,
    // MatPaginatorModule,
    // BrowserAnimationsModule
  ],
  declarations: [SubscribtionPage]
})
export class SubscribtionPageModule {}

