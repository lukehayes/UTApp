import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsPage } from './notifications.page';
import { CommonServiceModule } from '../services/common-service/common-service.module';
const routes: Routes = [
  {
    path: '',
    component: NotificationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonServiceModule],
  exports: [RouterModule, CommonServiceModule],
})
export class NotificationsPageRoutingModule {}
