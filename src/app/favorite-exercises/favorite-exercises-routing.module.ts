import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteExercisesPage } from './favorite-exercises.page';

const routes: Routes = [
  {
    path: '',
    component: FavoriteExercisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteExercisesPageRoutingModule {}
