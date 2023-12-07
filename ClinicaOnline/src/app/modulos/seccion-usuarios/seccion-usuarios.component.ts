import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent {

  form : FormGroup;

  mostrarToast = false;
  mensaje = "";

  especialistas : any[] = [];
  pacientes : any[] = [];
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

  fotoPaciente : string = 'assets/usuario.png';
  paciente : any;
  historial : any[] = [];
  diaHistorial : any;


  turnos : any[] = [];

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
    this.observable = this.firestoreService.traer('usuarios').subscribe((data) => {

      this.pacientes = [];
      this.especialistas = [];
      data.forEach(usuario => {
        if(usuario.tipo === 'paciente')
        {
          this.pacientes.push(usuario);
        }
        else
        {
          if(usuario.tipo === 'especialista')
          {
            this.especialistas.push(usuario);
          }
        }
      });
      console.log(data);
    });

    this.firestoreService.traer('turnos').subscribe((data)=>{
      this.turnos = data;
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
  
      this.firestoreService.modificar('usuarios', usuario).then(()=>{
        this.especialistas = [];
  
        this.mostrarToast = true;
        this.mensaje = 'Especialista aprobado.';
  
        setTimeout(() => {
          this.mostrarToast = false;
        }, 3000);
      });
    }
    else
    {
      if(aprobado === 'rechazado')
      {
        let usuario = especialista;
        usuario.aprobado = false;
    
        this.firestoreService.modificar('usuarios', usuario).then(()=>{
          this.especialistas = [];
    
          this.mostrarToast = true;
          this.mensaje = 'Especialista aprobado.';
    
          setTimeout(() => {
            this.mostrarToast = false;
          }, 3000);
        });
      }
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
      if(div === 'registro')
      {
        this.mostrarListado = false;
        this.mostrarRegistro = true;
      }
      else
      {
        this.mostrarListado = false;
        this.mostrarRegistro = false;
      }
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
                                'aprobado' : false,
                                'tipo' : 'administrador'};
          
            this.firestoreService.guardar('usuarios', especialista);
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


  seleccionarPaciente(paciente : any)
  {
    this.historial = [];
    this.diaHistorial = '';
    this.paciente = paciente;
    paciente.historialClinico.forEach((h:any) => {
      let hist = JSON.parse(h);
      this.historial.push(hist);
    });
    this.fotoPaciente = paciente.foto;
  }

  volver()
  {
    this.router.navigate(['/home']);
  }





  armarExcel(paciente?: any)
  {
    let array: any[] = [];
    let nombre = '';

    if(paciente)
    {
      this.turnos.forEach(turno => {
        if(turno.dniPaciente === paciente.dni)
        {
          array.push({resenia: turno.resenia, especialidad: turno.especialidad, paciente: turno.apellidoPaciente, especialista: turno.apellidoEspecialista, hora: turno.hora, dia: turno.dia});
        }
      });

      nombre = `turnos_${paciente.dni}`;
    }
    else
    {
      this.turnos.forEach(turno => {

        array.push({resenia: turno.resenia, especialidad: turno.especialidad, paciente: turno.apellidoPaciente, especialista: turno.apellidoEspecialista, hora: turno.hora, dia: turno.dia, especialaidad : turno.especialidad});
        
      });
      nombre = `turnos_completos`;
    }

    this.ExportarExcel(array, nombre);
  }

  
  ExportarExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.guardarExcel(excelBuffer, excelFileName);
  }

  guardarExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
