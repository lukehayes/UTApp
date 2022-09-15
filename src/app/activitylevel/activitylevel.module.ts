import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitylevelPageRoutingModule } from './activitylevel-routing.module';

import { ActivitylevelPage } from './activitylevel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitylevelPageRoutingModule
  ],
  declarations: [ActivitylevelPage]
})
export class ActivitylevelPageModule {}
