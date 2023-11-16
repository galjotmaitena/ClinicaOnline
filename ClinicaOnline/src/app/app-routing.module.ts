import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { TurnosComponent } from './componentes/turnos/turnos.component';

const routes: Routes = 
[ 
  {path:'registroooo', component:RegistroComponent},
  {path:'login', component:LoginComponent},
{ path: 'home', loadChildren: () => import('./modulos/home/home.module').then(m => m.HomeModule) },
{ path: 'seccionUsuarios', loadChildren: () => import('./modulos/seccion-usuarios/seccion-usuarios.module').then(m => m.SeccionUsuariosModule) },
{ path: '**', redirectTo: 'error', pathMatch: 'full'},
{ path: '', redirectTo: 'home', pathMatch: 'full'},
{ path: 'misTurnos', loadChildren: () => import('./modulos/mis-turnos/mis-turnos.module').then(m => m.MisTurnosModule) },
{path:'turnos', component:TurnosComponent},
{ path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
