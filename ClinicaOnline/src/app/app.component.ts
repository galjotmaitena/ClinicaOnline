import { Component } from '@angular/core';
import  firebase  from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClinicaOnline';

  ngOnInit()
  {
    firebase.initializeApp({"projectId":"tp-clinicaonline-19318","appId":"1:100338874045:web:0fb46c11160aae842ae9d4","storageBucket":"tp-clinicaonline-19318.appspot.com","apiKey":"AIzaSyAvBzaxSw3DQLRBBsL3zb4Gt-XZk6Foy5o","authDomain":"tp-clinicaonline-19318.firebaseapp.com","messagingSenderId":"100338874045"});
  }
}
