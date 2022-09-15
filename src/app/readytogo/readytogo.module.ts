import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadytogoPageRoutingModule } from './readytogo-routing.module';

import { ReadytogoPage } from './readytogo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadytogoPageRoutingModule
  ],
  declarations: [ReadytogoPage]
})
export class ReadytogoPageModule {}
