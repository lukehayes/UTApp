import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentpagePage } from './paymentpage.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentpagePageRoutingModule {}
