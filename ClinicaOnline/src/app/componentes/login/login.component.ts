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

  especialistas : any[] = [];
  observable : any;
  esEspecialista = false;
  usuario : any = '';

  btnsE : any[] = [];
  btnsP : any[] = [];
  btnsA : any[] = [];
  oP : any;
  oA : any;

  accesos : any[] = [];
  correos : any[] = ['galjotmaitena@gmail.com', 'maitegaljot02@gmail.com', 'maitebordolina02@gmail.com', 'maitenagaljot@hotmail.com'];

  constructor(private formBuilder: FormBuilder, private authService : AuthService, private firestoreService : FirestoreService, private router : Router)
  {
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
      clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  ngOnInit()
  {
    this.observable = this.firestoreService.traer('usuarios').subscribe((data) => {
      data.forEach(u => {
        if(u.tipo === 'especialista')
        {
          this.especialistas.push(u);
        }
      });
    });

    this.correos.forEach(c => {
      this.traerFotos(c);        //admin
    });

  }

  async ingresar()
  {
    let user;

    this.especialistas.forEach(especialista => {
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
    
          if(this.authService.getUser()?.emailVerified)
          {
            this.correo = '';
            this.clave = '';
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
      case "galjotmaitena@gmail.com":
        this.correo = "galjotmaitena@gmail.com";
        this.clave = "maimai02";
        break;
      case "maitegaljot02@gmail.com":
        this.correo = "maitegaljot02@gmail.com";
        this.clave = "11111111";
        break;
      case "maitebordolina02@gmail.com":
        this.correo = "maitebordolina02@gmail.com";
        this.clave = "11111111";
        break;
      case "maitenagaljot@hotmail.com":
        this.correo = "maitenagaljot@hotmail.com";
        this.clave = "11111111";
        break;
    }
  }

  traerFotos(correo : string)
  {
    let observable = this.firestoreService.traer('usuarios').subscribe((data)=>{
      

      data.forEach(u => {
        if(u.correo === correo)
        {
          this.accesos.push({'correo' : correo, 'foto' : u.foto});
          console.log(this.accesos);
        }
      });
    })
  }
}
