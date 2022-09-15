import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
ReactiveFormsModule
import { IonicModule } from '@ionic/angular';

import { ForumfilterPageRoutingModule } from './forumfilter-routing.module';

import { ForumfilterPage } from './forumfilter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    ForumfilterPageRoutingModule
  ],
  declarations: [ForumfilterPage]
})
export class ForumfilterPageModule {}
