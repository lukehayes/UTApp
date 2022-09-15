import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadytogoPage } from './readytogo.page';

const routes: Routes = [
  {
    path: '',
    component: ReadytogoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadytogoPageRoutingModule {}
