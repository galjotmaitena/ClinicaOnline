import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent {

  esAdmin = false;
  usuario : any;
  userLogeado = false;
  tipo : string = '';

  especialistas : any[] = [];
  especialidades : any[] = [];
  pacientes : any[] = [];

  mostrarEspecialidades = false;
  mostrarDias = false;

  paciente : any = null;

  especialidadFoto : any;
  especialista : any = null;
  especialidad : any = null;

  fechasProximas : any[] = [];
  dias : number[] = [];

  dia : any = null;
  horarios : any[] = [];
  horariosMostrar : any[] = [];

  hora : any = null;

  observable : any;
  turnos : any[] = [];

  constructor(private router : Router, private authService : AuthService, private firestoreService : FirestoreService){}

  ngOnInit()
  {
    if(this.authService.getUser()?.email)
    {
      this.userLogeado = true;

      this.especialistas = [];
      this.pacientes = [];

      this.firestoreService.traer('usuarios').subscribe((data)=>{
        data.forEach(u => {
          if(this.authService.getUser()?.email === u.correo)
          {
            this.usuario = u;

            if(u.tipo === 'administrador')
            {
              this.esAdmin = true;
            }
            else
            {
              if(u.tipo === 'paciente')
              {
                this.paciente = u;
              }
            }
          }
          else
          {
            if(u.tipo === 'especialista')
            {
              this.especialistas.push(u);
            }
            else
            {
              if(u.tipo === 'paciente')
              {
                this.pacientes.push(u);
              }
            }
          }
        });
      });
    }

    this.observable = this.firestoreService.traer('turnos').subscribe((data)=>{
      this.turnos = data;
    });
  }

  buscarEspecialidad(especialista : any)
  {
    this.especialidadFoto = null;
    this.especialista = especialista;
    this.especialidades = [];
    this.horarios = [];
    this.fechasProximas = [];
    this.dia = null;
    this.especialistas.forEach(e => {
      if(e === especialista)
      {
        e.especialidad.forEach((especialidad : any) => {
          let esp = JSON.parse(especialidad);
          this.asignarFoto(esp.especialidad);
        });

        this.mostrarEspecialidades = true;
      }
    });
  }

  buscarTurnos(especialidad : any)
  {
    this.mostrarDias = true;
    this.fechasProximas = [];
    this.dias = [];
    this.horarios = [];
    this.dia = null;
    this.hora = null;

    this.especialidadFoto = especialidad;

    this.especialistas.forEach(e => {
      if(e === this.especialista)
      {
        e.especialidad.forEach((es : any) => {
          let esp = JSON.parse(es);

          if(esp.especialidad === especialidad.especialidad)
          {
            this.especialidad = esp;

            esp.dias.forEach((d : any) => {
              this.asignarNumero(d);
            });

            this.obtenerDias();
          }
        });

        this.mostrarEspecialidades = true;
      }
    });

    if(this.fechasProximas.length <= 0)
    {
      Swal.fire("Aviso!", "No hay turnos disponibles para esta especialidad con este especialista...", "warning");
    }
  }

  obtenerDias()
  {
    let referencia : Date = new Date();
    
    for(let i = 0; i < 15; i++)
    {
      let fechaActual : Date = new Date(referencia);
      fechaActual.setDate(referencia.getDate() + i);

      for(let j = 0; j < this.dias.length; j++)
      {
        if(fechaActual.getDay() === this.dias[j])
        {
          this.fechasProximas.push(fechaActual.toLocaleDateString([], { day: '2-digit', month: '2-digit' }));
        }
      }
    }
  }

  crearFecha(hora: number, minutos: number): Date {
    const fecha = new Date();
    fecha.setHours(hora, minutos, 0, 0);
    return fecha;
  }

  obtenerHorarios(fecha : any)
  {
    this.horarios = [];
    this.dia = fecha;

    let entradaTrabajo = 8;
    let salidaTrabajo = 16;
    let duracionTurno = this.especialidad.duracionTurno;
    let totalMinutosTrabajo = (salidaTrabajo - entradaTrabajo) * 60;
    let cantidadTurnos = totalMinutosTrabajo / duracionTurno;

    for (let i = 0; i < cantidadTurnos; i++) 
    {
      let b = false;
      const minutosDesdeInicio = i * duracionTurno;

      const horaTurno = Math.floor(minutosDesdeInicio / 60) + entradaTrabajo;
      const minutosTurno = minutosDesdeInicio % 60;

      const fechaTurno = this.crearFecha(horaTurno, minutosTurno).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      this.turnos.forEach(t => {
        if(t.dia === fecha && t.hora === fechaTurno)
        {
          b = true;
        }
      });

      if(!b)
      {
        this.horarios.push(fechaTurno);
      }
    }
  }

  solicitarTurno()
  {
    if(this.paciente !== null && this.especialista !== null && this.especialidad !== null && this.dia !== null && this.hora !== null)
    {
      let turno = { dniPaciente : this.paciente.dni, 
        apellidoPaciente : this.paciente.apellido,
        dniEspecialista : this.especialista.dni, 
        apellidoEspecialista : this.especialista.apellido,
        especialidad : this.especialidad.especialidad,
        dia : this.dia,
        hora : this.hora,
        aceptado : false,
        cancelado : false,
        rechazado : false,
        realizado : false,
        finalizado : false,
        resenia: ''};

      this.firestoreService.guardar('turnos', turno);
      Swal.fire("Listo!", "El turno fue registrado exitosamente...", "success");

      this.hora = null;
      this.dia = null;
      this.especialidad = null;
      this.especialista = null;
      this.horarios = [];
      this.fechasProximas = [];
      this.paciente = null;
    }
    else
    {
      Swal.fire("Error", "No se pudo registrar el turno, algun dato es incorrecto...", "error");
    }
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

  asignarNumero(diaSemana : string)
  {
    switch(diaSemana)
    {
      case 'Lunes':
        this.dias.push(1);
        break;
      case 'Martes':
        this.dias.push(2);
        break;
      case 'Miercoles':
        this.dias.push(3);
        break;
      case 'Jueves':
        this.dias.push(4);
        break;
      case 'Viernes':
        this.dias.push(5);
        break;
      case 'Sabado':
        this.dias.push(6);
        break;
    }
  }

  seleccionarPaciente(pacienteSeleccionado : any)
  {
    this.paciente = pacienteSeleccionado;
  }

  volver()
  {
    this.router.navigate(['/home']);
  }
}
