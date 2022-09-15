import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartsModule } from 'ng2-charts';
import { WorkoutprogressPageRoutingModule } from './workoutprogress-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { WorkoutprogressPage } from './workoutprogress.page';

@NgModule({
  imports: [
    CommonModule,ChartsModule,
    FormsModule,NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    IonicModule,
    WorkoutprogressPageRoutingModule
  ],
  declarations: [WorkoutprogressPage]
})
export class WorkoutprogressPageModule {}
