import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseWorkoutTypePageRoutingModule } from './choose-workout-type-routing.module';

import { ChooseWorkoutTypePage } from './choose-workout-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseWorkoutTypePageRoutingModule
  ],
  declarations: [ChooseWorkoutTypePage]
})
export class ChooseWorkoutTypePageModule {}
