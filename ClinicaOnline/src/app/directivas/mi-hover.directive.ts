import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[miHover]'
})
export class MiHoverDirective {

  constructor(private elem: ElementRef) { }

  @HostListener('mouseenter')
    onMouseEnter()
    {
      this.cambiarColor('blue');
    }

    @HostListener('mouseleave')
    onMouseLeave()
    {
      this.cambiarColor('black');
    }

  cambiarColor(color: string)
  {
    this.elem.nativeElement.style.color = color;
  }

}
