import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteExercisesPageRoutingModule } from './favorite-exercises-routing.module';

import { FavoriteExercisesPage } from './favorite-exercises.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteExercisesPageRoutingModule
  ],
  declarations: [FavoriteExercisesPage]
})
export class FavoriteExercisesPageModule {}
