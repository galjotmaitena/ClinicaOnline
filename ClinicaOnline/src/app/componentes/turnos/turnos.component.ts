import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent {

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

  constructor(private aFirestorage : AngularFireStorage,  private authService : AuthService, private firestoreService : FirestoreService, private formBuilder: FormBuilder, private router : Router)
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
        this.turnos.push(t);
      });
    })
  }

  filtrar(filtro : string)
  {
    this.firestoreService.traer('turnos').subscribe((data)=>{
      this.turnos = [];
      data.forEach(t => {
         if(t.especialidad === filtro || t.especialista === filtro)
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
        if(this.filtro === 'especialista')
          {
            if(!this.listado.includes(t.especialista))
            {
              this.listado.push(t.especialista);
              console.log(t.especialista);
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
        
        
      });

      console.log(this.listado);
    });
  }

  volver()
  {
    this.router.navigate(['/home']);
  }


  abrirModal(turno : any)
  {
    this.abrir = true;
    this.turno = turno;
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
