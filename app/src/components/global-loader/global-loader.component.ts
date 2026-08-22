import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  templateUrl: './global-loader.component.html',
  host: {
    class:
      'fixed inset-0 z-[10000] flex items-center justify-center bg-background/60 backdrop-blur-[1px] cursor-wait',
    role: 'alertdialog',
    'aria-modal': 'true',
    'aria-busy': 'true',
    'aria-label': 'Loading',
  },
})
export class GlobalLoaderComponent {
  @HostListener('click', ['$event'])
  @HostListener('mousedown', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('pointerdown', ['$event'])
  @HostListener('wheel', ['$event'])
  @HostListener('touchstart', ['$event'])
  onInteract(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }
}
