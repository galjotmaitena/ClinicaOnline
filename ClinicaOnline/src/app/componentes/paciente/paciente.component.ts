import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent {
  esEspecialista = false;
  auth = this.authService.getUser()?.email;
  userLogeado = false;
  usuario : any;

  listado : any[] = [];
  opcion = '';
  filtro = '';

  turnos : any[] = [];

  abrir = false;
  comentario = '';
  turno : any;

  especialistas : any[] = [];

  resenia : string = '';

  constructor(private aFirestorage : AngularFireStorage,  private authService : AuthService, private firestoreService : FirestoreService, private formBuilder: FormBuilder, private router : Router)
  {
  }

  ngOnInit()
  {
    this.turnos = [];
    this.listado = [];
    if(this.auth)
    {
      this.userLogeado = true;

      this.firestoreService.traer('usuarios').subscribe((data)=>{
        data.forEach(u => {
          if(this.auth === u.correo)
          {
            this.usuario = u;
            //this.router.navigate(['misTurnos/paciente']);
            this.firestoreService.traer('turnos').subscribe((data)=>{
              this.turnos = [];
              data.forEach(t => {
                if(t.dniPaciente === u.dni)
                {
                  this.turnos.push(t);
                }
              });
            });

          }
          else
          {
            if(u.tipo === 'especialista')
            {
              this.especialistas.push(u);
            }
          }
        });
      });
    }
    else
    {
      this.router.navigate(['/home']);
    }




  }

  filtrar(filtro : string)
  {
    this.firestoreService.traer('turnos').subscribe((data)=>{
      this.turnos = [];
      data.forEach(t => {
        if(t.dniPaciente === this.usuario.dni)
        {
          if(t.especialidad === filtro || t.apellidoEspecialista === filtro)
          {
            this.turnos.push(t);
          }
          else
          {
            if(this.filtro === '')
            {
              this.turnos.push(t);
            }
          }
        }

      });
    });
  }

  seleccionarFiltro(filtro : string)
  {
    this.filtro = filtro;
    this.mostrarListado();
  }

  mostrarListado()
  {
    this.turnos = [];

    let observable = this.firestoreService.traer('turnos').subscribe((data)=>{
      this.listado = [];
      data.forEach(t => {
        if(t.dniPaciente === this.usuario.dni)
        {
          if(this.filtro === 'especialista')
          {
            if(!this.listado.includes(t.apellidoEspecialista))
            {
              this.listado.push(t.apellidoEspecialista);
            }
          }
          else
          {
            if(this.filtro === 'especialidad')
            {
              if(!this.listado.includes(t.especialidad))
              {
                this.listado.push(t.especialidad);
                console.log(t.especialidad);
              }
            }
            else
            {
              this.listado = [];
              this.filtrar('');
            }
          }
        }
        
      });

      console.log(this.listado);
    });
  }

  volver()
  {
    this.router.navigate(['/home']);
  }

  enviar()
  {
    this.turno.resenia = this.comentario;
    this.turno.cancelado = true;
    this.firestoreService.modificar('turnos', this.turno);
    this.comentario = '';
    this.abrir = false;
  }

  cambiarEstado(turno : any, estado : string)
  {
    this.turno = turno;

    switch(estado)
    {
      case 'cancelar':
        this.abrir = true;
        break;
      case 'encuesta':

        break;
      case 'calificar':

        break;
      case 'resenia':
        this.abrir = true;
        this.resenia = turno.resenia;
        break;
    }

    //this.firestoreService.modificar('turnos', this.turno);
  }

  cerrar()
  {
    this.abrir = false;
    this.mostrarListado();
  }
}
