import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyWorkoutExercisesPage } from './my-workout-exercises.page';

const routes: Routes = [
  {
    path: '',
    component: MyWorkoutExercisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWorkoutExercisesPageRoutingModule {}
