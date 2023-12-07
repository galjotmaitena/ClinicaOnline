import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation =
  trigger('routeAnimations', 
    [
        transition('home => perfil', [
        query(':enter, :leave', 
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ opacity: 0 }),
            animate('0.5s ease-out',
              style({ opacity: 1 })
            )
          ], { optional: true }),
          query(':leave', [
            style({ opacity: 1 }),
            animate('0.5s ease-out',
              style({ opacity: 0 })
            )
          ], { optional: true }),
        ])
    ]),

    transition('perfil => home', [
        query(':enter, :leave', 
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('0.5s ease-out',
              style({ transform: 'translateY(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('0.5s ease-out',
              style({ transform: 'translateY(100%)' })
            )
          ]
          , { optional: true }),
        ])
    ]),  

    transition('home => misTurnos', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(100%)' })
            )
          ], { optional: true }),
        ])
      ]),

      transition('misTurnos => home', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(-100%)' })
            )
          ], { optional: true }),
        ])
    ]),

    transition('home => secUsuarios', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(100%)' })
            )
          ], { optional: true }),
        ])
      ]),
      
      transition('secUsuarios => home', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(-100%)' })
            )
          ], { optional: true }),
        ])
    ]),

    transition('home => registro', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(100%)' })
            )
          ], { optional: true }),
        ])
      ]),
      
      transition('registro => home', [
        query(':enter, :leave',
          style({ position: 'fixed', width: '100%', height: '100%' }),
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(0%)' })
            )
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s .5s ease-in-out',
              style({ transform: 'translateX(-100%)' })
            )
          ], { optional: true }),
        ])
    ]),
    
]);