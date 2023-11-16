import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent {

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
          if(this.auth === u.correo && u.tipo === 'especialista')
          {
            this.esEspecialista = true;
            this.usuario = u;
            this.router.navigate(['misTurnos/especialista']);

          }
          else
          {
            if(this.auth === u.correo)
            {
              this.usuario = u;
              this.router.navigate(['misTurnos/paciente']);

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



  volver()
  {
    this.router.navigate(['/home']);
  }


  
}
