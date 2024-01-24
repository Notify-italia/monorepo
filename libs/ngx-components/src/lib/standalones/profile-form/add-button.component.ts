import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[notify-add-item]',
  standalone: true,
  imports: [CommonModule],
  template: ` <button
    data-theme="notifytheme"
    class="btn w-full text-white/80 btn-primary bg-darkmode-200/40 brightness-90 z-10"
    type="button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>

    <span>aggiungi</span>
  </button>`,
})
export class AddButtonComponent {}
