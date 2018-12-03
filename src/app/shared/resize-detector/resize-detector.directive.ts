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

  @HostListener('window:resize', ['$event'])
  detectResize(event?: any): void {
    const width = this.element.nativeElement.offsetWidth;

    let cWidth = this.cardWidth;

    if (this.cardWidth === 200 && ((width + 50) < 768 || (event && event.target.innerWidth < 768))) {
      cWidth = 100;
    }

    const allCardsStyle = (width - cWidth) / this.totalCards;

    this.renderer.setStyle(this.element.nativeElement,
      'grid-template-columns',
      'repeat(' + this.totalCards + ', ' + (allCardsStyle + (allCardsStyle / this.totalCards)) + 'px)');

  }
}
