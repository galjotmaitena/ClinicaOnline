import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  esAdmin = false;
  usuario = this.authService.getUser()?.email;
  userLogeado = false;

  constructor(private authService : AuthService, private firestoreService : FirestoreService, private router : Router){}

  ngOnInit()
  {
    if(this.usuario)
    {
      this.userLogeado = true;

      this.firestoreService.traer('administradores').subscribe((data)=>{
        data.forEach(administradores => {
          if(this.usuario === administradores.correo)
          {
            this.esAdmin = true;
          }
        });
      });
    }
  }

  logout()
  {
    this.authService.logout()
    ?.then(()=>{
      this.userLogeado = false;
      this.usuario = "";
    })
    .catch((error)=>{
      setTimeout(() => {
        console.log("ERROR: ", error);
      }, 1500);
    })
  }

  seccion()
  {
    this.router.navigate(['/seccionUsuarios']);
  }
}
