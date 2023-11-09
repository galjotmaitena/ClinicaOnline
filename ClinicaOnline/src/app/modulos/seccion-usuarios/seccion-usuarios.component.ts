import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent {

  form : FormGroup;

  mostrarToast = false;
  mensaje = "";

  usuarios : any[] = [];
  observable : any;

  mostrarListado = false;
  mostrarRegistro = false;

  nombre : string = '';
  apellido : string = '';
  edad : number | null = null;
  dni : number | null = null;

  correo : string = '';
  clave : string = '';
  claveRep : string = '';

  foto1 : any = '';
  fotoSeleccionada1 = false;

  constructor(private aFirestorage : AngularFireStorage,  private authService : AuthService, private firestoreService : FirestoreService, private formBuilder: FormBuilder, private router : Router)
  {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, this.contieneSoloLetras()]],
      apellido: ['', [Validators.required, this.contieneSoloLetras()]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dni: ['', [Validators.required,  Validators.pattern('^[0-9]+$')]],
      correo: ['', [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
      clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      claveRep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  ngOnInit()
  {
    this.observable = this.firestoreService.traer('especialistas').subscribe((data) => {

      this.usuarios = [];
      data.forEach(usuario => {
        if(!usuario.aprobado)
        {
          this.usuarios.push(usuario);
        }
      });
      console.log(data);
    });
  }

  
  contieneSoloNumeros(cadena: string) : boolean 
  {
    const expresionRegular = /^\d+$/;
    return expresionRegular.test(cadena);
  }

  contieneSoloLetras() : ValidatorFn 
  {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value) {
        // Elimina los espacios en blanco al principio y al final del valor
        const trimmedValue = value.trim();
        // Comprueba si el valor contiene solo letras y espacios en blanco
        if (!/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/.test(trimmedValue)) {
          return { 'invalido': true };
        }
      }
      return null;
    };
  }

  seleccionar(aprobado : string, especialista : any)
  {
    if(aprobado === 'aprobado')
    {
      let usuario = especialista;
      usuario.aprobado = true;
  
      this.firestoreService.modificar('especialistas', usuario).then(()=>{
        this.usuarios = [];
  
        this.mostrarToast = true;
        this.mensaje = 'Especialista aprobado.';
  
        setTimeout(() => {
          this.mostrarToast = false;
        }, 3000);
      });
    }
    else
    {
      this.mostrarToast = true;
      this.mensaje = 'Especialista rechazado.';

      setTimeout(() => {
        this.mostrarToast = false;
      }, 3000);
    }

  }

  mostrarDiv(div : string)
  {
    if(div === 'listado')
    {
      this.mostrarListado = true;
      this.mostrarRegistro = false;
    }
    else
    {
      this.mostrarListado = false;
      this.mostrarRegistro = true;
    }
  }

  seleccionarFoto(foto : number)
  {
    if(foto === 1)
    {
      this.fotoSeleccionada1 = true;
    }
  }

  alta()
  {
    if(!this.form.valid)
    {
      this.mostrarToast = true;
      this.mensaje = 'Usted no selecciono el perfil o no completo todos los campos';

      setTimeout(() => {
        this.mostrarToast = false;
      }, 3000);
    }
    else
    {
      if(this.clave === this.claveRep)
      {
        if(!this.fotoSeleccionada1)
        {
          this.mostrarToast = true;
          this.mensaje = 'Le falta ingresar la foto.';
    
          setTimeout(() => {
              this.mostrarToast = false;
          }, 3000);
          
        }
        else
        {
          this.guardarFoto('administrador', 'file1').then((data)=>{
            data.subscribe((url)=>{
              this.foto1 = url;
    
              let especialista = {'nombre' : this.nombre, 
                                'apellido' : this.apellido, 
                                'edad' : this.edad, 
                                'dni' : this.dni, 
                                'correo' : this.correo, 
                                'foto' : this.foto1,
                                'aprobado' : false};
          
            this.firestoreService.guardar('administradores', especialista);
            this.authService.signUp(this.correo, this.clave);
          
            this.limpiarCampos();
    
            this.mostrarToast = true;
            this.mensaje = 'Se dio de alta con exito.';
    
            setTimeout(() => {
              this.mostrarToast = false;
            }, 3000);
            });
    
          });
        }
      }
      else
      {
        this.mostrarToast = true;
        this.mensaje = 'Las contraseñas no coinciden';

        setTimeout(() => {
          this.mostrarToast = false;
        }, 3000);
      }
    }
  }

  async guardarFoto(tipo : string, id : string, numeroFoto? : number)
  {
    let fotoInput : any = <HTMLInputElement>document.getElementById(id);
    let storage = getStorage();
    let nombre = `${tipo}/${this.dni}`;

    if(numeroFoto)
    {
      nombre = `${tipo}/${numeroFoto}${this.dni}`;
    }

    let storageRef = ref(storage, nombre);

    await uploadBytes(storageRef as any, fotoInput.files[0] as any);

    let url = await this.aFirestorage.ref(nombre).getDownloadURL();

    return url;
  }

  limpiarCampos()
  {
    this.nombre = '';
    this.apellido = '';
    this.edad = null;
    this.dni = null;

    this.correo = '';
    this.clave = '';
    this.claveRep = '';

    this.foto1 = '';

    this.fotoSeleccionada1 = false;
  }

  volver()
  {
    this.router.navigate(['/home']);
  }
}
