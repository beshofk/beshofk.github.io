import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscribService } from 'src/app/services/subscrib.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


// export interface PeriodicElement {
//   email: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }


@Component({
  selector: 'app-subscribtion',
  templateUrl: './subscribtion.page.html',
  styleUrls: ['./subscribtion.page.scss'],
})
export class SubscribtionPage implements OnInit {
  users: any;
  MyDataSource: any;
  displayedColumns: string[] = ['name'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private subscribService: SubscribService) {
    this.getAllUsers();
   }

   ngOnInit() {
  }

  getAllUsers() {
    this.subscribService.getAllUsers().subscribe( res => {
        this.MyDataSource = new MatTableDataSource();
        this.MyDataSource.data = res;
        console.log(this.MyDataSource.data);
        this.MyDataSource.paginator = this.paginator;

    });

  }

}
