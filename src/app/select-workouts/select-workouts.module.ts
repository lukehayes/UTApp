import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectWorkoutsPageRoutingModule } from './select-workouts-routing.module';

import { SelectWorkoutsPage } from './select-workouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectWorkoutsPageRoutingModule
  ],
  declarations: [SelectWorkoutsPage]
})
export class SelectWorkoutsPageModule {}
