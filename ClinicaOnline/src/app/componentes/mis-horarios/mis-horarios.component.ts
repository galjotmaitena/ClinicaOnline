import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.scss']
})
export class MisHorariosComponent {

  usuario = this.authService.getUser()?.email;

  especialistas : any[] = [];
  especialidades : any[] = [];
  pacientes : any[] = [];
  dias : any[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

  especialista : any;

  mostrarDisponibilidad = false;

  especialidad : string = '';
  diasSeleccionados : any[] = [];
  diasLabel : string = '';

  duracion : number = 0;
  
  constructor(private router : Router, private authService : AuthService, private firestoreService : FirestoreService){}

  ngOnInit()
  {
    if(this.usuario)
    {
      this.firestoreService.traer('usuarios').subscribe((data)=>{
        data.forEach(u => {
          if(this.usuario === u.correo && u.tipo === 'especialista')
          {
            this.especialista = u;
            this.buscarEspecialidades();
          }
        });
      });
    }
  }

  buscarEspecialidades()
  {
    this.especialidades = [];
    this.especialista.especialidad.forEach((especialidad : any) => {
      let e = JSON.parse(especialidad);
      this.asignarFoto(e.especialidad);
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

  seleccionarDia(dia : string)
  {
    if(!this.diasSeleccionados.includes(dia))
    {
      this.diasSeleccionados.push(dia);
    }
    else
    {
      let index = this.diasSeleccionados.indexOf(dia);
      if(index !== -1)
      {
        this.diasSeleccionados.splice(index, 1);
      }
    }

    this.diasLabel = '';
    this.diasSeleccionados.forEach(e => {
      this.diasLabel += `${e} `;
    });
    
  }

  asignarDisponibilidad()
  {
    let e : any;

    if(this.duracion >= 1 && this.diasLabel !== '' && this.especialidad !== '')
    {
      for(let i = 0; i < this.especialista.especialidad.length; i++)
      {
        e = JSON.parse(this.especialista.especialidad[i]);

        if(e.especialidad === this.especialidad)
        {
          e.duracionTurno = this.duracion;
          e.dias = [];
          this.diasSeleccionados.forEach(d => {
            e.dias.push(d);
          });
        }

        this.especialista.especialidad[i] = JSON.stringify(e);
      }

      console.log(this.especialista);
      this.firestoreService.modificar('usuarios', this.especialista);

      this.duracion = 0;
      this.diasLabel = '';
      this.diasSeleccionados = [];
      this.especialidad = '';

      Swal.fire("Listo!", "Disponibilidad horaria asignada correctamente...", "success");
      this.router.navigate(['/home']);
    }
    else
    {
      Swal.fire('Error', 'Falta completar algun dato...', 'error');
    }
    
  }

  volver()
  {
    this.router.navigate(['/home']);
  }
}
