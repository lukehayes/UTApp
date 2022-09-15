import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumcommentsPageRoutingModule } from './forumcomments-routing.module';

import { ForumcommentsPage } from './forumcomments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumcommentsPageRoutingModule
  ],
  declarations: [ForumcommentsPage]
})
export class ForumcommentsPageModule {}
