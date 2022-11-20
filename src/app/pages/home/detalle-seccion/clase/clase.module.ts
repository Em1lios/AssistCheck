import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { IonicModule } from '@ionic/angular';

import { ClasePageRoutingModule } from './clase-routing.module';

import { ClasePage } from './clase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxQRCodeModule,
    IonicModule,
    ClasePageRoutingModule
  ],
  declarations: [ClasePage]
})
export class ClasePageModule {}
