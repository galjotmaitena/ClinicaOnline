import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';
import { PacientesComponent } from './componentes/pacientes/pacientes.component';
import { InformesComponent } from './componentes/informes/informes.component';

const routes: Routes = 
[ 
  { path:'login', component:LoginComponent},
  { path:'pacientes', component:PacientesComponent},
  { path: 'home', loadChildren: () => import('./modulos/home/home.module').then(m => m.HomeModule), data: { animation: 'home' } },
  { path: 'seccionUsuarios', loadChildren: () => import('./modulos/seccion-usuarios/seccion-usuarios.module').then(m => m.SeccionUsuariosModule), data:{animation:'secUsuarios'} },
  { path: '**', redirectTo: 'error', pathMatch: 'full'},
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'misTurnos', loadChildren: () => import('./modulos/mis-turnos/mis-turnos.module').then(m => m.MisTurnosModule), data:{animation:'misTurnos'} },
  { path:'turnos', component:TurnosComponent},
  { path:'informes', component:InformesComponent},
  { path:'solicitarTurno', component:SolicitarTurnoComponent},
  { path:'misHorarios', component:MisHorariosComponent},
  { path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule), data:{animation:'registro'} },
  { path: 'miPerfil', loadChildren: () => import('./modulos/mi-perfil/mi-perfil.module').then(m => m.MiPerfilModule), data:{animation:'perfil'} }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
