import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramAbilitiesPageRoutingModule } from './program-abilities-routing.module';

import { ProgramAbilitiesPage } from './program-abilities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramAbilitiesPageRoutingModule
  ],
  declarations: [ProgramAbilitiesPage]
})
export class ProgramAbilitiesPageModule {}
