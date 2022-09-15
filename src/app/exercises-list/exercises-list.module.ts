import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisesListPageRoutingModule } from './exercises-list-routing.module';

import { ExercisesListPage } from './exercises-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisesListPageRoutingModule
  ],
  declarations: [ExercisesListPage]
})
export class ExercisesListPageModule {}
