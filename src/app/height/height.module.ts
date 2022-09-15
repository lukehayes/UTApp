import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeightPageRoutingModule } from './height-routing.module';

import { HeightPage } from './height.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeightPageRoutingModule
  ],
  declarations: [HeightPage]
})
export class HeightPageModule {}
