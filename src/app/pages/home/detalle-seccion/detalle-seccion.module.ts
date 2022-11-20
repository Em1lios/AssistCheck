import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleSeccionPageRoutingModule } from './detalle-seccion-routing.module';

import { DetalleSeccionPage } from './detalle-seccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleSeccionPageRoutingModule
  ],
  declarations: [DetalleSeccionPage]
})
export class DetalleSeccionPageModule {}
