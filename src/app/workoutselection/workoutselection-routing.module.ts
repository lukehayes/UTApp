import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutselectionPage } from './workoutselection.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutselectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutselectionPageRoutingModule {}
