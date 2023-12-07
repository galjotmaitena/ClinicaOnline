import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[soloNumeros]'
})
export class SoloNumerosDirective {

  constructor(private readonly elRef : ElementRef) { }

  @HostListener('input', ['$event'])
  onChangeInput(event : Event) : void
  {
    const soloNumeros = /[^0-9]*/g;
    const initValue = this.elRef.nativeElement.value;
    this.elRef.nativeElement.value = initValue.replace(soloNumeros, '');
    if(initValue !== this.elRef.nativeElement.value)
    {
      event.stopPropagation();
    }
  }

}
