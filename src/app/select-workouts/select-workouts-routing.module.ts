import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectWorkoutsPage } from './select-workouts.page';

const routes: Routes = [
  {
    path: '',
    component: SelectWorkoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectWorkoutsPageRoutingModule {}
