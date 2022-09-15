import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RescheduleexercisePageRoutingModule } from './rescheduleexercise-routing.module';

import { RescheduleexercisePage } from './rescheduleexercise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RescheduleexercisePageRoutingModule
  ],
  declarations: [RescheduleexercisePage]
})
export class RescheduleexercisePageModule {}
