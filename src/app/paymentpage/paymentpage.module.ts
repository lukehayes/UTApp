import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaymentpagePageRoutingModule } from './paymentpage-routing.module';

import { PaymentpagePage } from './paymentpage.page';

@NgModule({
  imports: [
    CommonModule,NgxPayPalModule,
    FormsModule,
    IonicModule,
    PaymentpagePageRoutingModule
  ],
  declarations: [PaymentpagePage]
})
export class PaymentpagePageModule {}
