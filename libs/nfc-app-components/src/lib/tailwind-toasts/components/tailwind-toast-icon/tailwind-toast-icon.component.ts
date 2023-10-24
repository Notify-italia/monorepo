import { Component, Input } from '@angular/core';

@Component({
  selector: 'golden-tailwind-toast-icon',
  styles: [
    `
      svg {
        @apply w-6 h-6 my-auto;
      }
    `,
  ],
  templateUrl: './tailwind-toast-icon.component.html',
})
export class TailwindToastIconComponent {
  @Input() type: string = '';
}
