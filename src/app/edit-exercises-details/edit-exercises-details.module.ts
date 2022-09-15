import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditExercisesDetailsPageRoutingModule } from './edit-exercises-details-routing.module';

import { EditExercisesDetailsPage } from './edit-exercises-details.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  imports: [
    CommonModule,
    FormsModule, NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    IonicModule,
    EditExercisesDetailsPageRoutingModule
  ],
  declarations: [EditExercisesDetailsPage]
})
export class EditExercisesDetailsPageModule {}
