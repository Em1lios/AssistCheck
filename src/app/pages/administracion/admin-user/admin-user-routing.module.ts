import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminUserPage } from './admin-user.page';

const routes: Routes = [
  {
    path: '',
    component: AdminUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminUserPageRoutingModule {}
