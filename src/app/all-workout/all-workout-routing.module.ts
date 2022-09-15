import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllWorkoutPage } from './all-workout.page';

const routes: Routes = [
  {
    path: '',
    component: AllWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllWorkoutPageRoutingModule {}
