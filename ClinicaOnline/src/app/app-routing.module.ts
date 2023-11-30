import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';
import { PacientesComponent } from './componentes/pacientes/pacientes.component';

const routes: Routes = 
[ 
  {path:'registroooo', component:RegistroComponent},
  {path:'login', component:LoginComponent},
  {path:'pacientes', component:PacientesComponent},
{ path: 'home', loadChildren: () => import('./modulos/home/home.module').then(m => m.HomeModule) },
{ path: 'seccionUsuarios', loadChildren: () => import('./modulos/seccion-usuarios/seccion-usuarios.module').then(m => m.SeccionUsuariosModule) },
{ path: '**', redirectTo: 'error', pathMatch: 'full'},
{ path: '', redirectTo: 'home', pathMatch: 'full'},
{ path: 'misTurnos', loadChildren: () => import('./modulos/mis-turnos/mis-turnos.module').then(m => m.MisTurnosModule) },
{path:'turnos', component:TurnosComponent},
{path:'solicitarTurno', component:SolicitarTurnoComponent},
{path:'misHorarios', component:MisHorariosComponent},
{ path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule) },
{ path: 'miPerfil', loadChildren: () => import('./modulos/mi-perfil/mi-perfil.module').then(m => m.MiPerfilModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
