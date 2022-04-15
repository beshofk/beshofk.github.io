import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { TicketPage } from './ticket.page';
import { SharedModule } from 'src/app/shared.module';
import { MaterialModule } from 'src/app/material.module';

const routes: Routes = [
  {
    path: '',
    component: TicketPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    DatePipe
  ],

  declarations: [TicketPage]
})
export class TicketPageModule {}
