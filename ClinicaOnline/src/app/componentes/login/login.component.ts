import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  mostrarToast = false;
  mensaje = "";

  form : FormGroup;

  correo : string = '';
  clave : string = '';

  usuarios : any[] = [];
  observable : any;
  esEspecialista = false;
  usuario : any = '';

  constructor(private formBuilder: FormBuilder, private authService : AuthService, private firestoreService : FirestoreService, private router : Router)
  {
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
      clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  ngOnInit()
  {
    this.observable = this.firestoreService.traer('especialistas').subscribe((data) => {
      this.usuarios = data;
      
    });


  }

  async ingresar()
  {
    let user;

    this.usuarios.forEach(especialista => {
      if(especialista.correo === this.correo && especialista.aprobado === false)
      {
        user = especialista;
      }
    });

    if(user)
      {
        this.mostrarToast = true;
          this.mensaje = "El especialista aun no ha sido aprobado";
    
          setTimeout(() => {
            this.mostrarToast = false;
           
          }, 2000);
      }
      else
      {
        this.authService.login(this.correo, this.clave)
        ?.then(()=>{
          //this.firestoreService.guardar('logs', this.correo);
    
          if(this.authService.getUser()?.emailVerified)
          {
            setTimeout(() => {
              this.router.navigate(["/home"]);
            }, 2000);
          }
          else
          {
            this.mostrarToast = true;
            this.mensaje = "El email aun no ha sido verificado.";
    
            setTimeout(() => {
              this.mostrarToast = false;
            }, 2000);
          }
    
        })
        .catch((error)=>{
          this.mostrarToast = true;
          this.mensaje = "Correo o contraseña incorrecta!";
    
          setTimeout(() => {
            console.log("ERROR: ", error);
            this.mostrarToast = false;
          }, 2000);
    
        })
      }
  }

  cargarDatos(user : string)
  {
    switch(user)
    {
      case "1":
        this.correo = "galjotmaitena@gmail.com";
        this.clave = "44457866C";
        break;
      case "2":
        this.correo = "maitebordolina02@gmail.com";
        this.clave = "11111111";
        break;
    }
  }
}
