import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgressImagesPageRoutingModule } from './progress-images-routing.module';

import { ProgressImagesPage } from './progress-images.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgressImagesPageRoutingModule
  ],
  declarations: [ProgressImagesPage]
})
export class ProgressImagesPageModule {}
