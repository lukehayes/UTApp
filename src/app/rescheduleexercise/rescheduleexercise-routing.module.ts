import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RescheduleexercisePage } from './rescheduleexercise.page';

const routes: Routes = [
  {
    path: '',
    component: RescheduleexercisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RescheduleexercisePageRoutingModule {}
