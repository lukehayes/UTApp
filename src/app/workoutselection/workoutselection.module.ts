import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutselectionPageRoutingModule } from './workoutselection-routing.module';

import { WorkoutselectionPage } from './workoutselection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutselectionPageRoutingModule
  ],
  declarations: [WorkoutselectionPage]
})
export class WorkoutselectionPageModule {}
