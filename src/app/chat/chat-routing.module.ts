import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';
import { CommonServiceModule } from '../services/common-service/common-service.module';
const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonServiceModule],
  exports: [RouterModule, CommonServiceModule],
})
export class ChatPageRoutingModule {}
