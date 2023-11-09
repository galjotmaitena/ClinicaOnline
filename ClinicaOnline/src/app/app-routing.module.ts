import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';

const routes: Routes = 
[ 
  {path:'registro', component:RegistroComponent},
  {path:'login', component:LoginComponent},
{ path: 'home', loadChildren: () => import('./modulos/home/home.module').then(m => m.HomeModule) },
{ path: 'seccionUsuarios', loadChildren: () => import('./modulos/seccion-usuarios/seccion-usuarios.module').then(m => m.SeccionUsuariosModule) },
{ path: '**', redirectTo: 'error', pathMatch: 'full'},
{ path: '', redirectTo: 'home', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
