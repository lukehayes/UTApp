import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutprogressPage } from './workoutprogress.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutprogressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutprogressPageRoutingModule {}
