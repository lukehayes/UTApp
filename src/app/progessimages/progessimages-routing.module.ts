import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgessimagesPage } from './progessimages.page';

const routes: Routes = [
  {
    path: '',
    component: ProgessimagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgessimagesPageRoutingModule {}
