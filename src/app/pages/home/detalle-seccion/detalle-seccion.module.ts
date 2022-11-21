import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { DetalleSeccionPageRoutingModule } from './detalle-seccion-routing.module';

import { DetalleSeccionPage } from './detalle-seccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DetalleSeccionPageRoutingModule
  ],
  declarations: [DetalleSeccionPage]
})
export class DetalleSeccionPageModule {}
