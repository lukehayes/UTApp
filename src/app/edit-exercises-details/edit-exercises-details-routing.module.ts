import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditExercisesDetailsPage } from './edit-exercises-details.page';

const routes: Routes = [
  {
    path: '',
    component: EditExercisesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditExercisesDetailsPageRoutingModule {}
