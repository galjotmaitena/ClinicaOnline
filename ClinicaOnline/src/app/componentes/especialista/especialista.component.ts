import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { ConstantPool } from '@angular/compiler';
import Swal from 'sweetalert2';

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

  //abrir = false;
  accion : string = '';
  turno : any;

  resenia : string = '';

  altura : number | null = null;
  peso : number | null = null;
  temperatura : number | null = null;
  presion : number | null = null;

  campo1 : string | null = null;
  campo2 : string | null = null;
  valor1 : string | null = null;
  valor2 : string | null = null;

  mostrarHistoria : boolean = false;
  mostrarComentario : boolean = false;

  pacientes : any[] = [];

  constructor(private formBuilder: FormBuilder,private authService : AuthService, private firestoreService : FirestoreService, private router : Router) 
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
              console.log('***************');
              console.log(this.usuario);
              console.log('***************');
            }

            if(u.tipo === 'paciente')
            {
              this.pacientes.push(u);
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
          if(t.especialidad === filtro || t.apellidoPaciente === filtro)
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
    this.turnos = [];
    let observable = this.firestoreService.traer('turnos').subscribe((data)=>{
      this.listado = [];
      data.forEach(t => {
        if(t.dniEspecialista === this.usuario.dni)
        {
          if(this.filtro === 'paciente')
          {
            if(!this.listado.includes(t.apellidoPaciente))
            {
              this.listado.push(t.apellidoPaciente);
            }
          }
          else
          {
            if(this.filtro === 'especialidad')
            {
              if(!this.listado.includes(t.especialidad))
              {
                this.listado.push(t.especialidad);
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
    this.resenia = '';
    this.turno = turno;

    switch(estado)
    {
      case 'aceptar':
        this.mostrarComentario = false;
        this.mostrarHistoria = false;
        this.turno.aceptado = true;
        this.firestoreService.modificar('turnos', this.turno);
        Swal.fire("Listo!", "Turno aceptado...", "success");
        break;
      case 'resenia':
        this.mostrarComentario = true;
        this.mostrarHistoria = false;
        this.accion = 'resenia';
        this.resenia = turno.resenia;
        break;
      case 'cancelar':
        this.mostrarComentario = true;
        this.mostrarHistoria = false;
        this.accion = 'cancelar';
        Swal.fire("Aviso!", "Deje un comentario...", "warning");
        break;
      case 'rechazar':
        this.mostrarComentario = true;
        this.mostrarHistoria = false;
        this.accion = 'rechazar';
        Swal.fire("Aviso!", "Deje un comentario...", "warning");
        break;
      case 'finalizar':
        this.mostrarComentario = true;
        this.mostrarHistoria = true;
        this.accion = 'finalizar';
        Swal.fire("Aviso!", "Complete la historia clinica...", "warning");
        break;
    }
  }

  enviar(datos : string)
  {
    let pac : any;
    let cargado = false;

    if(datos === 'historia' && this.accion === 'finalizar')
    {
      if(this.altura !== null && this.peso !== null && this.temperatura !== null && this.presion !== null && this.resenia !== '')
      {
        this.pacientes.forEach((u : any) => {
          if(u.tipo === 'paciente' && u.dni === this.turno.dniPaciente)
          {
            pac = u;
          }
        });

        let objHistoria;

        if(this.campo1 !== null && this.valor1 !== null && this.campo2 !== null && this.valor2 !== null)
        {
          objHistoria = { altura:this.altura, 
                          peso:this.peso, 
                          temperatura:this.temperatura, 
                          presion:this.presion, 
                          fechaTurno:this.turno.dia, 
                          especialidad:this.turno.especialidad, 
                          especialista:this.turno.apellidoEspecialista, 
                          clave1 : this.campo1, 
                          valor1 : this.valor1,
                          clave2 : this.campo2,
                          valor2 : this.valor2};
          cargado = true;
        }
        else
        {
          if(this.campo1 === null && this.valor1 === null && this.campo2 === null && this.valor2 === null)
          {
            objHistoria = { altura:this.altura, 
                            peso:this.peso, 
                            temperatura:this.temperatura, 
                            presion:this.presion, 
                            fechaTurno:this.turno.dia, 
                            especialidad:this.turno.especialidad, 
                            especialista:this.turno.apellidoEspecialista};
            cargado = true;
          }
          else
          {
            if(this.campo2 !== null && this.valor2 !== null)
            {
              objHistoria = { altura:this.altura, 
                              peso:this.peso, 
                              temperatura:this.temperatura, 
                              presion:this.presion, 
                              fechaTurno:this.turno.dia, 
                              especialidad:this.turno.especialidad, 
                              especialista:this.turno.apellidoEspecialista, 
                              clave2 : this.campo2,
                              valor2 : this.valor2};
              cargado = true;
            }
            else
            {
              if(this.campo1 !== null && this.valor1 !== null)
              {
                objHistoria = { altura:this.altura, 
                                peso:this.peso, 
                                temperatura:this.temperatura, 
                                presion:this.presion, 
                                fechaTurno:this.turno.dia, 
                                especialidad:this.turno.especialidad, 
                                especialista:this.turno.apellidoEspecialista, 
                                clave1 : this.campo1,
                                valor1 : this.valor1};
                cargado = true;
              }
            }
          }
        }

        if(cargado)
        {
          pac.historialClinico.push(JSON.stringify(objHistoria));

          this.firestoreService.modificar('usuarios', pac);
          
          this.turno.resenia = this.resenia;
          this.turno.finalizado = true;
  
          Swal.fire("Listo!", "Los datos del paciente se cargaron correctamente...", "success");
          cargado = false;
        }
        else
        {
          Swal.fire("Error!", "Falta completar algun campo opcional...", "error");
        }
      }
      else
      {
        Swal.fire("Error!", "Faltaron completar campos...", "error");
      }
    }
    else
    {
      if(datos === 'comentario')
      {
        switch(this.accion)
        {
          case 'rechazar':
            this.turno.rechazado = true;
            break;
          case 'cancelar':
            this.turno.cancelado = true;
            break;
        }
        this.turno.resenia = this.resenia;
        Swal.fire("Listo!", "Comentario enviado...", "success");
      }
    }

    this.firestoreService.modificar('turnos', this.turno);

    this.resenia = '';
    this.mostrarComentario = false;
    this.mostrarHistoria = false;
  }

  cerrar()
  {
    this.resenia = '';
    
    this.mostrarListado();
  }
}
