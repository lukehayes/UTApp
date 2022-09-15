import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumcommentsPage } from './forumcomments.page';
import { CommonServiceModule } from '../../services/common-service/common-service.module';
const routes: Routes = [
  {
    path: '',
    component: ForumcommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonServiceModule],
  exports: [RouterModule, CommonServiceModule],
})
export class ForumcommentsPageRoutingModule {}
