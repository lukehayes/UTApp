import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyWorkoutsPage } from './my-workouts.page';

const routes: Routes = [
  {
    path: '',
    component: MyWorkoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWorkoutsPageRoutingModule {}
