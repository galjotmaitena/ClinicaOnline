
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component } from '@angular/core';

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

  historial : any;

  pacientes : any[] = [];

  prueba : any[] = [1,2,3,4,5];

  indiceActual: number = 0;

  turnos : any[] = [];
  turnosPaciente : any[] = [];

  verHistorial = false;
  verComentario = false;

  comentario : string = '';

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

      this.firestoreService.traer('turnos').subscribe((data1)=>{
        this.turnos = data1;
        data1.forEach(t => {
          this.firestoreService.traer('usuarios').subscribe((data)=>{
            data.forEach(u => {
    
              if(u.tipo === 'paciente' && u.dni === t.dniPaciente && this.usuario.dni === t.dniEspecialista)
              {
                this.pacientes.push(u);
              }
            });
          });
        });
      });

    }
  }

  buscarHistorial(fecha : any)
  {
    this.verHistorial = true;
    this.verComentario = false;
    this.historial = '';
    this.pacientes[this.indiceActual].historialClinico.forEach((h : any) => {
      let hist = JSON.parse(h);
      console.warn(hist);

      if(hist.fechaTurno === fecha)
      {
        this.historial = hist;
      }
    });

  }

  volver()
  {
    this.router.navigate(['/home']);
  }




  cambiarPaciente(paso: number): void 
  {
    this.indiceActual += paso;
  
    if (this.indiceActual < 0) 
    {
      this.indiceActual = this.pacientes.length - 1;
    } 
    else if (this.indiceActual >= this.pacientes.length) 
    {
      this.indiceActual = 0;
    }

    this.verComentario = false;
    this.verHistorial = false;
    this.buscarTurnos();
  }

  buscarTurnos()
  {
    let arrayTurnos : any= [];
    let fechasOrdenadas : any = [];
    let ultimasTresFechas : any = [];

    this.turnosPaciente = [];
    this.turnos.forEach(t => {
      if(t.dniPaciente === this.pacientes[this.indiceActual].dni && t.finalizado)
      { 
        let arrayFecha = t.dia.split('/');
        arrayTurnos.push(new Date(parseInt(arrayFecha[2]), parseInt(arrayFecha[1]) - 1, parseInt(arrayFecha[0])));
        //console.log(arrayTurnos);

        fechasOrdenadas = arrayTurnos.sort((a : any, b : any) => b.getTime() - a.getTime());
        ultimasTresFechas = fechasOrdenadas.slice(0, 3);
      }
    });

    this.mostrarTurnos(ultimasTresFechas);
  }

  mostrarTurnos(fechas : any)
  {
    fechas.forEach((f : any) => {
      this.turnos.forEach(t => {
        if(t.dniPaciente === this.pacientes[this.indiceActual].dni && t.finalizado)
        { 
          if(t.dia === f.toLocaleTimeString([], { day: 'numeric', month: 'numeric', year: 'numeric' }).split(',')[0])
          {
            this.turnosPaciente.push(t);
          }
        }
      });
    });
  }
}
