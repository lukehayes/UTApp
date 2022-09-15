import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleallexercisesPageRoutingModule } from './scheduleallexercises-routing.module';

import { ScheduleallexercisesPage } from './scheduleallexercises.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleallexercisesPageRoutingModule
  ],
  declarations: [ScheduleallexercisesPage]
})
export class ScheduleallexercisesPageModule {}
