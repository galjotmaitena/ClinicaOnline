import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {

  esAdmin = false;
  user = this.authService.getUser();
  userLogeado = false;
  tipo : string = '';

  usuario : any;

  especialidades : any[] = [];

  historial : any[] = [];

  pacientes : any[] = [];

  constructor(private authService : AuthService, private firestoreService : FirestoreService, private router : Router){}

  ngOnInit()
  {
    if(this.user?.email)
    {
      this.userLogeado = true;

      this.firestoreService.traer('usuarios').subscribe((data)=>{
        data.forEach(u => {
          if(this.user?.email === u.correo)
          {
            this.tipo = u.tipo;
            this.usuario = u;
            console.log(this.usuario);
          }
        });
      });

      this.firestoreService.traer('usuarios').subscribe((data)=>{
        data.forEach(u => {

          if(u.tipo === 'paciente')
          {
            this.buscarHistorial(u);
          }
        });
      });

      this.pacientes.forEach(p => {
        this.buscarHistorial(p);
      });

      console.log(this.pacientes);
      console.log(this.historial);
    }

    
  }

  buscarHistorial(paciente : any)
  {
    this.historial = [];
    paciente.historialClinico.forEach((h : any) => {
      let hist = JSON.parse(h);
      if(hist.especialista === this.usuario.apellido)
      {
        this.historial.push(hist);
      }
    });
  }

  volver()
  {
    this.router.navigate(['/home']);
  }

}
