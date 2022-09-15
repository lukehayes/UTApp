import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleallexercisesPage } from './scheduleallexercises.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleallexercisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleallexercisesPageRoutingModule {}
