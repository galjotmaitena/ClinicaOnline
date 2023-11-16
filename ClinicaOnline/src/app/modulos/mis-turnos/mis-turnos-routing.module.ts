import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from './mis-turnos.component';
import { SolicitarTurnoComponent } from 'src/app/componentes/solicitar-turno/solicitar-turno.component';
import { PacienteComponent } from 'src/app/componentes/paciente/paciente.component';
import { EspecialistaComponent } from 'src/app/componentes/especialista/especialista.component';

const routes: Routes = 
[ { path: '', component: MisTurnosComponent, 
    children:[{path:'paciente', component:PacienteComponent},
              {path:'especialista', component:EspecialistaComponent}] },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisTurnosRoutingModule { }
