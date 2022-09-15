import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitylevelPage } from './activitylevel.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitylevelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitylevelPageRoutingModule {}
