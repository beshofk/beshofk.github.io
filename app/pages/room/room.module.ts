import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomPage } from './room.page';
import { SharedModule } from 'src/app/shared.module';
import { MaterialModule } from 'src/app/material.module';

const routes: Routes = [
  {
    path: '',
    component: RoomPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoomPage]
})
export class RoomPageModule {}
