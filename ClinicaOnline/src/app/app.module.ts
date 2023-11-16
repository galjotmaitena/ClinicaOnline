import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { PacienteComponent } from './componentes/paciente/paciente.component';
import { EspecialistaComponent } from './componentes/especialista/especialista.component';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { RegPacienteComponent } from './componentes/reg-paciente/reg-paciente.component';
import { RegEspecialistaComponent } from './componentes/reg-especialista/reg-especialista.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    SolicitarTurnoComponent,
    EspecialistaComponent,
    TurnosComponent,
    RegPacienteComponent,
    RegEspecialistaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"tp-clinicaonline-19318","appId":"1:100338874045:web:0fb46c11160aae842ae9d4","storageBucket":"tp-clinicaonline-19318.appspot.com","apiKey":"AIzaSyAvBzaxSw3DQLRBBsL3zb4Gt-XZk6Foy5o","authDomain":"tp-clinicaonline-19318.firebaseapp.com","messagingSenderId":"100338874045"})),
    provideAuth(() => getAuth()),
    FormsModule,
    ReactiveFormsModule,
    provideFirestore(() => getFirestore()),
    AngularFireStorageModule,
    AngularFireModule.initializeApp({"projectId":"tp-clinicaonline-19318","appId":"1:100338874045:web:0fb46c11160aae842ae9d4","storageBucket":"tp-clinicaonline-19318.appspot.com","apiKey":"AIzaSyAvBzaxSw3DQLRBBsL3zb4Gt-XZk6Foy5o","authDomain":"tp-clinicaonline-19318.firebaseapp.com","messagingSenderId":"100338874045"}),

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
