import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';


import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,AngularFireAuthModule ,IonicModule.forRoot(), AppRoutingModule
    ,AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },BarcodeScanner],
  bootstrap: [AppComponent],
})
export class AppModule {}
