import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[miActive]'
})
export class MiActiveDirective {

  constructor(private elem: ElementRef, private renderer: Renderer2) { }

  @HostListener('click')
  onClick() {
    // Aplica el efecto de "clic" directamente al estilo del elemento
    this.renderer.setStyle(this.elem.nativeElement, 'box-shadow', '0 0 5px 0 blue');

    // Después de un tiempo (puedes ajustar esto), quita el efecto
    setTimeout(() => {
      this.renderer.removeStyle(this.elem.nativeElement, 'box-shadow');
    }, 1000);
  }

}
