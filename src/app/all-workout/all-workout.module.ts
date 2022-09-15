import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllWorkoutPageRoutingModule } from './all-workout-routing.module';

import { AllWorkoutPage } from './all-workout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllWorkoutPageRoutingModule
  ],
  declarations: [AllWorkoutPage]
})
export class AllWorkoutPageModule {}
