import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminSeccionPage } from './admin-seccion.page';

const routes: Routes = [
  {
    path: '',
    component: AdminSeccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminSeccionPageRoutingModule {}
