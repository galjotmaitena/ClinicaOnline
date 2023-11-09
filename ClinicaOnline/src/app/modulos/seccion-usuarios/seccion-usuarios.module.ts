import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeccionUsuariosRoutingModule } from './seccion-usuarios-routing.module';
import { SeccionUsuariosComponent } from './seccion-usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SeccionUsuariosComponent
  ],
  imports: [
    CommonModule,
    SeccionUsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SeccionUsuariosModule { }
