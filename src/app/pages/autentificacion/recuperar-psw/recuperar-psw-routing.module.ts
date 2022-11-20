import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarPswPage } from './recuperar-psw.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarPswPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarPswPageRoutingModule {}
