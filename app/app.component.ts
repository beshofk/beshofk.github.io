import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterEvent, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages = [
    {
      title: 'الاشتراكات الرئيسية',
      url: '/menu/admin'
    },
    {
      title: 'كل المشتركين',
      url: '/menu/all'
    },
    {
      title: 'الغرف',
      url: '/menu/rooms'
    },
    {
      title: 'باص شبرا',
      url: '/menu/shoubra'
    },
    {
      title: 'باص ميرلاند',
      url: '/menu/meriland'
    },
    {
      title: 'إحصائيات',
      url: '/menu/statistics'
    }

  ];
  selectedPath = '';
  showMenu: boolean = false;
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private router: Router,
    private auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      this.router.events.subscribe((event: RouterEvent) => {
        if (event.url != undefined) {
          this.selectedPath = event.url;
        } else {
          this.selectedPath = this.router.url;
        }
      });
      this.showMenu = window.location.href.indexOf('menu') !== -1;
    });
  }

  signOut() {
    this.auth.signOut();
  }
  }

