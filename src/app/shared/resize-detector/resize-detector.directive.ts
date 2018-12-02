import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[resize-detector]',
})

export class ResizeDetectorDirective implements OnInit {

  @Input() cardWidth: number;
  @Input() totalCards: number;

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.detectResize();
  }

  @HostListener('window:resize')
  detectResize(): void {
    const allCardsStyle = (this.element.nativeElement.offsetWidth - this.cardWidth) / this.totalCards;

    this.renderer.setStyle(this.element.nativeElement,
      'grid-template-columns',
      'repeat(' + this.totalCards + ', ' + (allCardsStyle + (allCardsStyle / this.totalCards)) + 'px)');

  }
}
