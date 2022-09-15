import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressImagesPage } from './progress-images.page';

const routes: Routes = [
  {
    path: '',
    component: ProgressImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgressImagesPageRoutingModule {}
