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
  usuario : any = '';
  userLogeado = false;

  constructor(private authService : AuthService, private firestoreService : FirestoreService, private router : Router){}

  ngOnInit()
  {
    this.firestoreService.traer('usuarios').subscribe((data)=>{
      if(this.authService.getUser())
      {
        this.userLogeado = true;

        data.forEach(u => {
          if(this.authService.getUser()?.email === u.correo)
          {
            this.usuario = u;
          }
        });
      }
    });
  }

  logout()
  {
    this.authService.logout()
    ?.then(()=>{
      this.userLogeado = false;
      this.esAdmin = false;
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
