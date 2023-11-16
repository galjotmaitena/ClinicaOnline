import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-especialista',
  templateUrl: './especialista.component.html',
  styleUrls: ['./especialista.component.scss']
})
export class EspecialistaComponent {

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

  constructor(private authService : AuthService, private firestoreService : FirestoreService, private router : Router)
  {
  }

  ngOnInit()
  {
    if(this.auth)
    {
      this.userLogeado = true;

      this.firestoreService.traer('usuarios').subscribe((data)=>{
        data.forEach(u => {
          
            if(this.auth === u.correo)
            {
              this.usuario = u;

            }
        });
      });
    }
    else
    {
      this.router.navigate(['/home']);
    }

    this.firestoreService.traer('turnos').subscribe((data)=>{
      this.turnos = [];
      data.forEach(t => {
        if(t.dniEspecialista === this.usuario.dni)
        {
          this.turnos.push(t);
        }
      });
    })
  }

  filtrar(filtro : string)
  {
    this.firestoreService.traer('turnos').subscribe((data)=>{
      this.turnos = [];
      data.forEach(t => {
        if(t.dniEspecialista === this.usuario.dni)
        {
          if(t.especialidad === filtro || t.paciente === filtro)
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
    console.log(this.filtro);
  }

  mostrarListado()
  {
    let observable = this.firestoreService.traer('turnos').subscribe((data)=>{
      this.listado = [];
      data.forEach(t => {
        if(t.dniEspecialista === this.usuario.dni)
        {
          if(this.filtro === 'paciente')
          {
            if(!this.listado.includes(t.paciente))
            {
              this.listado.push(t.paciente);
              console.log(t.paciente);
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


  cambiarEstado(turno : any, estado : string)
  {
    this.turno = turno;

    switch(estado)
    {
      case 'rechazar':
        this.turno.rechazado = true;
        this.abrir = true;
        break;
      case 'cancelar':
        this.turno.cancelado = true;
        this.abrir = true;
        break;
      case 'aceptar':
        this.turno.aceptado = true;
        this.firestoreService.modificar('turnos', this.turno);
        break;
      case 'finalizar':
        this.turno.finalizado = true;
        this.abrir = true;
        break;
      case 'resenia':
        this.abrir = true;
        break;
    }
  }

  enviar()
  {
    this.turno.resenia = this.comentario;
    this.firestoreService.modificar('turnos', this.turno);
    this.comentario = '';
    this.abrir = false;
  }

  cerrar()
  {
    this.abrir = false;
    this.mostrarListado();
  }
}
