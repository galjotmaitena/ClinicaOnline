import { core } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  form : FormGroup;

  mostrarToast = false;
  mensaje = "";

  especialidades : any[] = [];
  especialistas : any[] = [];
  especialista = -1;

  nombre : string = '';
  apellido : string = '';
  edad : number | null = null;
  dni : number | null = null;

  obraSocial : string = '';
  especialidad : string = '';

  correo : string = '';
  clave : string = '';
  claveRep : string = '';

  foto1 : any = '';
  fotoSeleccionada1 = false;
  foto2 : any = '';  
  fotoSeleccionada2 = false;


  imagenes : any[] = [];

  observable : any;

  constructor(private aFirestorage : AngularFireStorage, private formBuilder: FormBuilder, private authService : AuthService, private firestoreService : FirestoreService)
  {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, this.contieneSoloLetras()]],
      apellido: ['', [Validators.required, this.contieneSoloLetras()]],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dni: ['', [Validators.required,  Validators.pattern('^[0-9]+$')]],
      obraSocial: ['', [this.contieneSoloLetras()]],
      especialidad: ['', [this.contieneSoloLetras()]],
      correo: ['', [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
      clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      claveRep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  ngOnInit()
  {
    this.observable = this.firestoreService.traer('especialistas').subscribe((data) => {
      this.especialistas = data;
      console.log(data);

      this.especialidades = [];

      data.forEach(especialista => {
        if(!this.especialidades.includes(especialista.especialidad))
        {
          this.especialidades.push(especialista.especialidad);
        }
      });
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

  seleccionarPerfil(perfil : string)
  {
    if(perfil === 'especialista')
    {
      this.especialista = 1;
    }
    else
    {
      this.especialista = 0;
    }
  }

  seleccionarFoto(foto : number)
  {
    if(foto === 1)
    {
      this.fotoSeleccionada1 = true;
    }
    else
    {
      this.fotoSeleccionada2 = true;
    }
  }

  alta()
  {
    if(!this.form.valid  || this.especialista === -1)
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
        if(this.especialista === 1)
        {
          this.darAltaEspecialista();
        }
        else
        {
          if(this.especialista === 0)
          {
            this.darAltaPaciente();
          }
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

  darAltaEspecialista()
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
      this.guardarFoto('especialista', 'file1').then((data)=>{
        data.subscribe((url)=>{
          this.foto1 = url;

          let especialista = {'nombre' : this.nombre, 
                            'apellido' : this.apellido, 
                            'edad' : this.edad, 
                            'dni' : this.dni, 
                            'especialidad' : this.especialidad, 
                            'correo' : this.correo, 
                            'foto' : this.foto1,
                            'aprobado' : false};
      
        this.firestoreService.guardar('especialistas', especialista);
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

  darAltaPaciente()
  {
    if(!this.fotoSeleccionada1 || !this.fotoSeleccionada2)
    {
      this.mostrarToast = true;
      this.mensaje = 'Le falta ingresar alguna foto.';

      setTimeout(() => {
        this.mostrarToast = false;
      }, 3000);
    }
    else
    {
      this.guardarFoto('pacientes', 'file1', 1).then((data)=>{
        data.subscribe((url)=>{
          this.foto1 = url;

          this.guardarFoto('pacientes', 'file2', 2).then((data2)=>{
            data2.subscribe((url2)=>{
              this.foto2 = url2;
  
              let especialista = {'nombre' : this.nombre, 
                              'apellido' : this.apellido, 
                              'edad' : this.edad, 
                              'dni' : this.dni, 
                              'obraSocial' : this.obraSocial, 
                              'correo' : this.correo, 
                              'foto1' : this.foto1,
                              'foto2' : this.foto2};
        
          this.firestoreService.guardar('pacientes', especialista);
          this.authService.signUp(this.correo, this.clave);
        
          this.limpiarCampos();
          
          this.mostrarToast = true;
          this.mensaje = 'Se dio de alta con exito.';
  
          setTimeout(() => {
            this.mostrarToast = false;
          }, 3000);
          });
            });
  
        });

        
          
      });
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

  seleccionarEspecialidad(especialidad : string)
  {
    this.especialidad = especialidad;
  }

  limpiarCampos()
  {
    this.especialidades = [];
    this.nombre = '';
    this.apellido = '';
    this.edad = null;
    this.dni = null;

    this.obraSocial = '';
    this.especialidad = '';

    this.correo = '';
    this.clave = '';
    this.claveRep = '';

    this.foto1 = '';
    this.foto2 = '';

    this.fotoSeleccionada1 = false;
    this.fotoSeleccionada2 = false;
  }
}