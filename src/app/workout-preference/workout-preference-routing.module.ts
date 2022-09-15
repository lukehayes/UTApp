import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutPreferencePage } from './workout-preference.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPreferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutPreferencePageRoutingModule {}
