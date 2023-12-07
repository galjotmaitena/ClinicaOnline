import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AuthService } from 'src/app/services/auth.service';
import { MiHoverDirective } from 'src/app/directivas/mi-hover.directive';
import { MiActiveDirective } from 'src/app/directivas/mi-active.directive';


@NgModule({
  declarations: [
    HomeComponent,
    MiHoverDirective,
    MiActiveDirective,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { 

}
