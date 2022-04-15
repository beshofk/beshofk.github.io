import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';

import { CdkDetailRowDirective } from './pages/admin-dashboard/cdk-detail-row.directive';


const modules = [
  CommonModule,
  FormsModule,
  IonicModule,
  ReactiveFormsModule,
  FontAwesomeModule
];

@NgModule({
  declarations: [CdkDetailRowDirective],
  imports: modules,
  exports: modules
})
export class SharedModule { }
