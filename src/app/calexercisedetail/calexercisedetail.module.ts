import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalexercisedetailPageRoutingModule } from './calexercisedetail-routing.module';

import { CalexercisedetailPage } from './calexercisedetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalexercisedetailPageRoutingModule
  ],
  declarations: [CalexercisedetailPage]
})
export class CalexercisedetailPageModule {}
