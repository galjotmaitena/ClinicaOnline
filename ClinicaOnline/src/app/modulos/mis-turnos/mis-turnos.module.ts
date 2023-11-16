import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos.component';
import { FormsModule } from '@angular/forms';
import { PacienteComponent } from 'src/app/componentes/paciente/paciente.component';


@NgModule({
  declarations: [
    MisTurnosComponent,
    PacienteComponent
  ],
  imports: [
    CommonModule,
    MisTurnosRoutingModule,
    FormsModule
  ]
})
export class MisTurnosModule { }
