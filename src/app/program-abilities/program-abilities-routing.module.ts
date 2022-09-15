import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramAbilitiesPage } from './program-abilities.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramAbilitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramAbilitiesPageRoutingModule {}
