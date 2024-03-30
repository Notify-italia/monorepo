import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[notify-remove-item-button]',
  standalone: true,
  template: `
    <button
      type="button"
      class="btn btn-error my-auto btn-ghost text-red-500 !p-1 text-sm"
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
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
      <span>Rimuovi</span>
    </button>
  `,
})
export class RemoveItemButtonComponent {}
