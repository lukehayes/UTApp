import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseWorkoutTypePage } from './choose-workout-type.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseWorkoutTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseWorkoutTypePageRoutingModule {}
