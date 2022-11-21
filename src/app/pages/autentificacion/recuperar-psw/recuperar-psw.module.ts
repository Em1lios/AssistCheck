import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RecuperarPswPageRoutingModule } from './recuperar-psw-routing.module';

import { RecuperarPswPage } from './recuperar-psw.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,TranslateModule,
    IonicModule,
    RecuperarPswPageRoutingModule
  ],
  declarations: [RecuperarPswPage]
})
export class RecuperarPswPageModule {}
