import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExercisesFilterPage } from './exercises-filter.page';

const routes: Routes = [
  {
    path: '',
    component: ExercisesFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesFilterPageRoutingModule {}
