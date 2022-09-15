import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisesFilterPageRoutingModule } from './exercises-filter-routing.module';

import { ExercisesFilterPage } from './exercises-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisesFilterPageRoutingModule
  ],
  declarations: [ExercisesFilterPage]
})
export class ExercisesFilterPageModule {}
