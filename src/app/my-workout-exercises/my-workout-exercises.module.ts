import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyWorkoutExercisesPageRoutingModule } from './my-workout-exercises-routing.module';

import { MyWorkoutExercisesPage } from './my-workout-exercises.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyWorkoutExercisesPageRoutingModule
  ],
  declarations: [MyWorkoutExercisesPage]
})
export class MyWorkoutExercisesPageModule {}
