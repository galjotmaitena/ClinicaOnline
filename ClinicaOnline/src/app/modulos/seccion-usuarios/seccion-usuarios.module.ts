import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeccionUsuariosRoutingModule } from './seccion-usuarios-routing.module';
import { SeccionUsuariosComponent } from './seccion-usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderAscPipe } from 'src/app/pipes/order-asc.pipe';


@NgModule({
  declarations: [
    SeccionUsuariosComponent,
    OrderAscPipe
  ],
  imports: [
    CommonModule,
    SeccionUsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SeccionUsuariosModule { }
