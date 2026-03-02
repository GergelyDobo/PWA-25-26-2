import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appHighlightDirective]',
})
export class HighlightDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  @HostListener('mouseenter')
  onMouseEnter() {
    this.elementRef.nativeElement.style.background = 'yellow';
    this.elementRef.nativeElement.style.fontWeight = 'bold';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.elementRef.nativeElement.style.background = '';
    this.elementRef.nativeElement.style.fontWeight = 'normal';
  }
}
