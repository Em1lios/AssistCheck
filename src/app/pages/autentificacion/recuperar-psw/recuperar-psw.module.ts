import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarPswPageRoutingModule } from './recuperar-psw-routing.module';

import { RecuperarPswPage } from './recuperar-psw.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RecuperarPswPageRoutingModule
  ],
  declarations: [RecuperarPswPage]
})
export class RecuperarPswPageModule {}
