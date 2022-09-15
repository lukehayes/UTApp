import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NutritionDetailsPageRoutingModule } from './nutrition-details-routing.module';

import { NutritionDetailsPage } from './nutrition-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NutritionDetailsPageRoutingModule
  ],
  declarations: [NutritionDetailsPage]
})
export class NutritionDetailsPageModule {}
