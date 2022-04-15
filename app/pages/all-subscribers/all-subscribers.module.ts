import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllSubscribersPage } from './all-subscribers.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AllSubscribersPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AllSubscribersPage]
})
export class AllSubscribersPageModule {}
