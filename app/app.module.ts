import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TicketPageModule } from './pages/ticket/ticket.module';
import { RoomPageModule } from './pages/room/room.module';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { ExcelService } from './services/excel.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CustomMatPaginatorIntl } from '../custom-mat-paginator-int';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
// import { MatPaginatorIntl } from '@angular/material/paginator';
import { SharedModule } from './shared.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';

const firbaseModules = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore()),
  AngularFireModule.initializeApp(environment.firebase)
];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    SharedModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    firbaseModules,
    TicketPageModule,
    RoomPageModule,
    // PapaParseModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FontAwesomeModule
  ],
  providers: [
    // StatusBar,
    ExcelService,
    // SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  //  { provide: MatPaginatorIntl,
  //   useClass: CustomMatPaginatorIntl
  //  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
