import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgessimagesPageRoutingModule } from './progessimages-routing.module';

import { ProgessimagesPage } from './progessimages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgessimagesPageRoutingModule
  ],
  declarations: [ProgessimagesPage]
})
export class ProgessimagesPageModule {}
