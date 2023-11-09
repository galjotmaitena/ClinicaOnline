import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  password : string = "";
  email : string = "";

  constructor(private auth : Auth, private router : Router) { }

  login(email : string, password : string)
  {
    let retorno;

    try
    {
      this.password = password;
      this.email = email;
      retorno = signInWithEmailAndPassword(this.auth, email, password);
    }
    catch(error)
    {
      console.log("Error en login: ", error);
      retorno = null;
    }

    return retorno;
  }

  async signUp(email : string, password : string)
  {
    let retorno;

    try
    {
      retorno = createUserWithEmailAndPassword(this.auth, email, password).then((data)=>{
        this.mandarEmail(data.user);
      });
    }
    catch(error)
    {
      console.log("Error en register: ", error);
      retorno = null;
    }

    return retorno;
  }

  logout()
  {
    return signOut(this.auth);
  }

  getPassword() : string
  {
    return this.password;
  }

  getEmail() : string
  {
    return this.email;
  }

  mandarEmail(usuario : any)
  {
    return sendEmailVerification(usuario);
  }

  getUser()
  {
    return this.auth.currentUser;//para obtener el email acceder con .email. Para corroborar que te trajo algo, solo hace un if(user)
  }
}
