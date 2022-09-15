import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleexercisePageRoutingModule } from './scheduleexercise-routing.module';

import { ScheduleexercisePage } from './scheduleexercise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleexercisePageRoutingModule
  ],
  declarations: [ScheduleexercisePage]
})
export class ScheduleexercisePageModule {}
