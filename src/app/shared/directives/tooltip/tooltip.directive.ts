import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})

export class TooltipDirective {

  @Input()
  tooltipTitle: string = '';

  tooltip: HTMLElement | null = null;
  offset = 10;

  constructor(private el: ElementRef,
              private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltip) {
      this.show();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }

  private show() {
    this.tooltip = this.renderer.createElement('span');

    if (!this.tooltip) {
      return;
    }

    this.tooltip.className = 'tooltip-text';
    this.tooltip.textContent = this.tooltipTitle;
    this.renderer.appendChild(document.body, this.tooltip);

    const hostPos = this.el.nativeElement.getBoundingClientRect();

    const tooltipPos = this.tooltip.getBoundingClientRect();

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    const top = hostPos.top - tooltipPos.height - this.offset + scrollPos;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'z-index', '1000');
  }

  private hide() {
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;
  }
}
