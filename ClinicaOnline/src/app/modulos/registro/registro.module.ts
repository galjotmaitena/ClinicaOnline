import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { FormsModule } from '@angular/forms';

//import { ReCaptchaV3Module } from 'ng-recaptcha';

@NgModule({
  declarations: [
    RegistroComponent
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    FormsModule,
    //ReCaptchaV3Module
  ]
})
export class RegistroModule { }
