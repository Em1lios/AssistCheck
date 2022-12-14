import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { AdminSeccionPageRoutingModule } from './admin-seccion-routing.module';

import { AdminSeccionPage } from './admin-seccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,TranslateModule,
    ReactiveFormsModule,
    IonicModule,
    AdminSeccionPageRoutingModule
  ],
  declarations: [AdminSeccionPage]
})
export class AdminSeccionPageModule {}
