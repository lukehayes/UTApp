import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleexercisePage } from './scheduleexercise.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleexercisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleexercisePageRoutingModule {}
