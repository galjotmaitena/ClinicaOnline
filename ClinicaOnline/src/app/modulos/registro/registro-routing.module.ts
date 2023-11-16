import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './registro.component';
import { RegPacienteComponent } from 'src/app/componentes/reg-paciente/reg-paciente.component';
import { RegEspecialistaComponent } from 'src/app/componentes/reg-especialista/reg-especialista.component';

const routes: Routes = [
  { path: '', component: RegistroComponent, 
  children:[{path:'paciente', component:RegPacienteComponent},
            {path:'especialista', component:RegEspecialistaComponent}]}, ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
