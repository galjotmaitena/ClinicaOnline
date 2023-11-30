import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  seleccionado = false;

  constructor(private router : Router){}

  ngOnInit()
  {
    this.seleccionado  = false;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) 
      {
        if (event.url === '/registro/paciente' || event.url === '/registro/especialista') 
        {
          this.seleccionado = true;
        } 
        else 
        {
          this.seleccionado  = false;
        }
      }
    });
  }

  seleccionar()
  {
    this.seleccionado = !this.seleccionado
  }
}
