import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeightPage } from './height.page';

const routes: Routes = [
  {
    path: '',
    component: HeightPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeightPageRoutingModule {}
