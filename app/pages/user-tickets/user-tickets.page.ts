import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { TicketService } from 'src/app/services/ticket.service';
import { TicketPageModule } from '../ticket/ticket.module';
import { TicketPage } from '../ticket/ticket.page';

@Component({
  selector: 'app-user-tickets',
  templateUrl: './user-tickets.page.html',
  styleUrls: ['./user-tickets.page.scss'],
})
export class UserTicketsPage implements OnInit {

  constructor(private auth: AuthService, private modalCtrl: ModalController, private ticket:TicketService) { }

  ngOnInit() {
  }

  async openTicketModal()
  {
    const modal=await this.modalCtrl.create({
      component:TicketPage
    });
    await modal.present();
  }

  signOut(){  
    this.auth.signOut();
  }
}
