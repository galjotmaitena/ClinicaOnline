import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent {

  esAdmin = false;
  user = this.authService.getUser();
  userLogeado = false;
  tipo : string = '';

  usuario : any;

  especialidades : any[] = [];

  historial : any[] = [];

  historialSeleccionado : any;

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

            if(u.tipo === 'especialista')
            {
              this.buscarEspecialidades();
            }
            else
            {
              if(u.tipo === 'paciente')
              {
                this.buscarHistorial();
              }
            }
          }
        });
      });
    }
  }

  buscarEspecialidades()
  {
    this.especialidades = [];
    this.usuario.especialidad.forEach((especialidad : any) => {
      let e = JSON.parse(especialidad);
      this.asignarFoto(e.especialidad);
    });
  }

  buscarHistorial()
  {
    this.historial = [];
    this.usuario.historialClinico.forEach((h : any) => {
      let hist = JSON.parse(h);
      this.historial.push(hist);
    });
  }

  asignarFoto(especialidad : string)
  {
    switch(especialidad)
    {
      case 'dentista':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/dentista.png"});
        break;
      case 'clinico':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/clinico.png"});
        break;
      case 'psicologia':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/psicologia.png"});
        break;
      case 'ginecologia':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/ginecologia.png"});
        break;
      case 'cardiologia':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/cardiologia.png"});
        break;
      case 'nutricionista':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/nutricionista.png"});
        break;
      case 'traumatologia':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/traumatologia.png"});
        break;
      case 'pediatria':
        this.especialidades.push({especialidad : especialidad, foto : "assets/especialidades/pediatria.png"});
        break;
      default:
        this.especialidades.push({especialidad : especialidad, foto : "assets/signo-de-hospital.png"});
    }
  }
  
  volver()
  {
    this.router.navigate(['/home']);
  }
}
