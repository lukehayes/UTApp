import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyWorkoutsPageRoutingModule } from './my-workouts-routing.module';

import { MyWorkoutsPage } from './my-workouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyWorkoutsPageRoutingModule
  ],
  declarations: [MyWorkoutsPage]
})
export class MyWorkoutsPageModule {}
