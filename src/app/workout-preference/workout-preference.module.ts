import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPreferencePageRoutingModule } from './workout-preference-routing.module';

import { WorkoutPreferencePage } from './workout-preference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutPreferencePageRoutingModule
  ],
  declarations: [WorkoutPreferencePage]
})
export class WorkoutPreferencePageModule {}
