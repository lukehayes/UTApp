import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalexercisedetailPage } from './calexercisedetail.page';
import { CommonServiceModule } from '../services/common-service/common-service.module';
const routes: Routes = [
  {
    path: '',
    component: CalexercisedetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonServiceModule],
  exports: [RouterModule, CommonServiceModule],
})
export class CalexercisedetailPageRoutingModule {}
