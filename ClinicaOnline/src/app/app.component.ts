import { Component } from '@angular/core';
import  firebase  from 'firebase/compat/app';
import { slideInAnimation } from './animaciones';
import { ChildrenOutletContexts } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ slideInAnimation ]
})
export class AppComponent {
  title = 'ClinicaOnline';

  constructor(private contexts: ChildrenOutletContexts){}

  ngOnInit()
  {
    firebase.initializeApp({"projectId":"tp-clinicaonline-19318","appId":"1:100338874045:web:0fb46c11160aae842ae9d4","storageBucket":"tp-clinicaonline-19318.appspot.com","apiKey":"AIzaSyAvBzaxSw3DQLRBBsL3zb4Gt-XZk6Foy5o","authDomain":"tp-clinicaonline-19318.firebaseapp.com","messagingSenderId":"100338874045"});
  }

  getRouteAnimationData() {
    const animationData = this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    console.log('Animation Data:', animationData);
    return animationData;
  }
  
}
