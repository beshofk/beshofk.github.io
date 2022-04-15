import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRoomsPage } from './admin-rooms.page';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AdminRoomsPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminRoomsPage]
})
export class AdminRoomsPageModule {}
